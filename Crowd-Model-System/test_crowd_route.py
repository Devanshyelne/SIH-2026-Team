from crowd_route import choose_low_crowd_route


routes = {

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


results = choose_low_crowd_route(
    routes,
    hour=18,
    day_of_week=1,
    mins_to_next_train=5
)


print("\n=== CROWD-AWARE ROUTE RECOMMENDATION ===")

for result in results:

    print(f"\n{result['name']}")
    print(f"Route: {' -> '.join(result['route'])}")
    print(f"Crowd: {result['crowd']}%")
    print(f"Level: {result['level']}")


recommended = results[0]

print("\n=== RECOMMENDED ROUTE ===")
print(f"Route: {' -> '.join(recommended['route'])}")
print(f"Crowd: {recommended['crowd']}%")
print(f"Level: {recommended['level']}")