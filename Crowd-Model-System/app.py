import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from crowd_system import get_crowd
from crowd_route import choose_low_crowd_route


app = Flask(__name__)
allowed_origins = [origin.strip() for origin in os.getenv("CORS_ORIGIN", "*").split(",") if origin.strip()]
CORS(app, origins=allowed_origins)


ZONES = [
    "PF5",
    "PF11",
    "FOB_CENTRAL",
    "FOB_SOUTH",
    "EAST_SKYWALK",
    "STAIRS_SOUTH"
]


ROUTES = {
    "Fastest Route": [
        "PF5",
        "FOB_CENTRAL",
        "PF11"
    ],

    "Alternative Route": [
        "PF5",
        "EAST_SKYWALK",
        "PF11"
    ],

    "South Route": [
        "PF5",
        "FOB_SOUTH",
        "PF11"
    ]
}


def request_parameters():
    try:
        hour = int(request.args.get("hour", 18))
        day = int(request.args.get("day", 1))
        train = int(request.args.get("train", 5))
    except ValueError:
        return None, (jsonify({"message": "hour, day, and train must be integers"}), 400)

    if not 0 <= hour <= 23 or not 0 <= day <= 6 or train < 0:
        return None, (jsonify({"message": "hour must be 0-23, day must be 0-6, and train must be non-negative"}), 400)

    return (hour, day, train), None


@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "service": "Dadar Station Crowd API"
    })


@app.route("/api/crowd")
def crowd():

    params, error = request_parameters()
    if error:
        return error
    hour, day, train = params

    results = []

    for zone in ZONES:

        result = get_crowd(
            zone_id=zone,
            hour=hour,
            day_of_week=day,
            mins_to_next_train=train
        )

        results.append(result)

    return jsonify({
        "station": "Dadar",
        "hour": hour,
        "zones": results
    })


@app.route("/api/routes")
def routes():

    params, error = request_parameters()
    if error:
        return error
    hour, day, train = params

    results = choose_low_crowd_route(
        ROUTES,
        hour=hour,
        day_of_week=day,
        mins_to_next_train=train
    )

    recommended = results[0]

    return jsonify({
        "recommended": recommended,
        "routes": results
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=os.getenv("FLASK_DEBUG") == "true"
    )
