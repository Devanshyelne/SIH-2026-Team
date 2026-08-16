from routing1 import predict_crowd

zones = [
    "PF5",
    "PF11",
    "FOB_CENTRAL",
    "FOB_SOUTH",
    "EAST_SKYWALK",
    "STAIRS_SOUTH"
]

print("=== CROWD PREDICTION ===")

for hour in [8, 11, 14, 18]:
    print(f"\nTime: {hour}:00")

    for zone in zones:
        crowd = predict_crowd(
            zone_id=zone,
            hour=hour,
            day_of_week=1,
            mins_to_next_train=5
        )

        print(f"{zone:15} -> {crowd:.1f}%")