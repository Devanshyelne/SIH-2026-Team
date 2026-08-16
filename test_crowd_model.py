from crowd_predictor import predict_crowd, crowd_level

# Three demo situations for the hackathon.
SCENARIOS = [
    ("Morning rush", 8, 1, 2),
    ("Off peak", 14, 1, 8),
    ("Evening rush", 18, 1, 3),
]
test_cases = [("Morninng normal",8,1,15),("Afternoon",14,1,15),("Evening rush",18,1,5),("Late evening",22,1,20)]
ZONES = [
    "PF5",
    "PF11",
    "FOB_CENTRAL",
    "FOB_SOUTH",
    "EAST_SKYWALK",
    "STAIRS_SOUTH",
]

for name, hour, dow, train_mins in SCENARIOS:
    print(f"\n=== {name} ===")
    for zone in ZONES:
        score = predict_crowd(zone, hour, dow, train_mins)
        print(f"{zone:15} -> {score:5.1f}% -> {crowd_level(score)}")
