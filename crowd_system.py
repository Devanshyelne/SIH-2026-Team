from routing1 import predict_crowd


def crowd_level(score):
    """
    Convert crowd prediction percentage into a crowd level.
    """

    if score < 30:
        return "LOW"

    elif score < 60:
        return "MODERATE"

    elif score < 80:
        return "HIGH"

    else:
        return "VERY HIGH"


def get_crowd(
    zone_id,
    hour,
    day_of_week=1,
    mins_to_next_train=5
):
    """
    Get predicted crowd percentage and crowd level
    for a particular station zone.
    """

    prediction = predict_crowd(
        zone_id=zone_id,
        hour=hour,
        day_of_week=day_of_week,
        mins_to_next_train=mins_to_next_train
    )

    return {
        "zone": zone_id,
        "percentage": round(prediction, 1),
        "level": crowd_level(prediction)
    }