import os
import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                          "crowd_model.pkl")

model = joblib.load(MODEL_PATH)
TRAIN_COLS = list(model.feature_names_in_)

ZONE_PROPS = {
    "PF5": ("platform", 600),
    "PF11": ("platform", 600),
    "FOB_CENTRAL": ("bridge", 280),
    "FOB_SOUTH": ("bridge", 280),
    "EAST_SKYWALK": ("bridge", 280),
    "STAIRS_SOUTH": ("staircase", 150),
}


def infer_zone_props(zone_id):
    if zone_id in ZONE_PROPS:
        return ZONE_PROPS[zone_id]

    if zone_id.startswith("PF"):
        return ("platform", 480)
    if zone_id.startswith("FOB") or zone_id == "EAST_SKYWALK":
        return ("bridge", 280)
    if zone_id.startswith("STAIRS"):
        return ("staircase", 150)
    if zone_id.startswith("ESCALATOR"):
        return ("staircase", 180)
    if zone_id.startswith("LIFT"):
        return ("facility", 40)
    return ("facility", 200)


def predict_crowd(
    zone_id,
    hour,
    day_of_week,
    mins_to_next_train=5,
    is_festival=0,
):
    zone_type, base_capacity = infer_zone_props(zone_id)

    row = {
        "hour": hour,
        "day_of_week": day_of_week,
        "is_weekend": int(day_of_week >= 5),
        "is_festival": is_festival,
        "mins_to_next_train": mins_to_next_train,
        "base_capacity": base_capacity,
    }

    for col in TRAIN_COLS:
        if col.startswith("zone_id_"):
            row[col] = int(col == f"zone_id_{zone_id}")
        elif col.startswith("zone_type_"):
            row[col] = int(col == f"zone_type_{zone_type}")
        elif col not in row:
            row[col] = 0

    X = pd.DataFrame([row])[TRAIN_COLS]
    value = float(model.predict(X)[0])
    return max(0.0, min(100.0, value))


def crowd_level(crowd):
    if crowd < 30:
        return "LOW"
    if crowd < 60:
        return "MODERATE"
    if crowd < 80:
        return "HIGH"
    return "VERY HIGH"


if __name__ == "__main__":
    zones = [
        "PF5",
        "PF11",
        "FOB_CENTRAL",
        "FOB_SOUTH",
        "EAST_SKYWALK",
        "STAIRS_SOUTH",
    ]

    for hour in [8, 11, 14, 18, 20]:
        print(f"\nTime: {hour:02d}:00")
        for zone in zones:
            score = predict_crowd(
                zone_id=zone,
                hour=hour,
                day_of_week=1,
                mins_to_next_train=5,
            )
            print(f"{zone:15} {score:5.1f}%  {crowd_level(score)}")
