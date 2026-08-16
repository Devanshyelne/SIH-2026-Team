from crowd_system import get_crowd


ZONES = [
    "PF5",
    "PF11",
    "FOB_CENTRAL",
    "FOB_SOUTH",
    "EAST_SKYWALK",
    "STAIRS_SOUTH"
]


def get_station_crowd(
    hour=18,
    day_of_week=1,
    mins_to_next_train=5
):

    results = []

    for zone in ZONES:

        result = get_crowd(
            zone_id=zone,
            hour=hour,
            day_of_week=day_of_week,
            mins_to_next_train=mins_to_next_train
        )

        results.append(result)

    return results