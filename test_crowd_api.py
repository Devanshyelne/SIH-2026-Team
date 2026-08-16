from crowd_api import get_station_crowd


results = get_station_crowd(
    hour=18,
    day_of_week=1,
    mins_to_next_train=5
)


print("=== DADAR STATION CROWD STATUS ===")

for result in results:

    print(
        f"{result['zone']:15} "
        f"{result['percentage']:5.1f}% "
        f"{result['level']}"
    )