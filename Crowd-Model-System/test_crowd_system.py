from crowd_system import get_crowd

zones = [
    "PF5",
    "PF11",
    "FOB_CENTRAL",
    "FOB_SOUTH",
    "EAST_SKYWALK",
    "STAIRS_SOUTH"
]

print("=== DADAR STATION CROWD STATUS ===")

for zone in zones:

    result = get_crowd(
        zone_id=zone,
        hour=8,
        day_of_week=1,
        mins_to_next_train=5
    )

    print(
        f"{result['zone']:15} "
        f"{result['percentage']:5.1f}% "
        f"{result['level']}"
    )