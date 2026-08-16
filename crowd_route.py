from crowd_system import get_crowd,crowd_level


def calculate_route_crowd(route, hour=18, day_of_week=1, mins_to_next_train=5):
    scores = []

    for zone in route:
        result = get_crowd(
            zone_id=zone,
            hour=hour,
            day_of_week=day_of_week,
            mins_to_next_train=mins_to_next_train
        )

        scores.append(result["percentage"])

    average_crowd = sum(scores) / len(scores)

    return round(average_crowd, 1)


def choose_low_crowd_route(
    routes,
    hour=18,
    day_of_week=1,
    mins_to_next_train=5
):

    results = []

    for name, route in routes.items():

        crowd = calculate_route_crowd(
            route,
            hour,
            day_of_week,
            mins_to_next_train
        )

        if crowd < 30:
            level = "LOW"
        elif crowd < 60:
            level = "MODERATE"
        elif crowd < 80:
            level = "HIGH"
        else:
            level = "VERY HIGH"

        results.append({
            "name": name,
            "route": route,
            "crowd": round(crowd, 1),
            "level": level
        })

    results.sort(key=lambda x: x["crowd"])

    return results