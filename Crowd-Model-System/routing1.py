"""
Dadar Station Navigation - Dijkstra Routing + Crowd-Weighted Cost
SIH 2026 PS-17 prototype

WHAT THIS FILE DOES:
1. Defines the station graph (nodes from your real dadar_graph_v0.json)
2. Uses PLACEHOLDER distances between nodes (flagged with # TODO below —
   your team already identified "real distances for PF5->PF11" as an
   unresolved blocker; replace these numbers once you have them)
3. Runs Dijkstra with crowd-weighted edge cost using the trained model
4. Demos PF5 -> PF11 at two different hours to show the route CHANGES
   when crowd levels change — that's your core demo moment

Run this file directly: python3 routing.py
"""

import heapq
import joblib
import pandas as pd
import numpy as np

# ---------------------------------------------------------------------------
# 1. GRAPH — real nodes, PLACEHOLDER distances (meters)
#    TODO: replace with real measured/estimated distances before final round
# ---------------------------------------------------------------------------
EDGES = [
    # (node_a, node_b, distance_m) — undirected
    # West-side vertical circulation -> FOB_CENTRAL (main spine)
    ("ENTRY_WEST", "TICKET_WEST", 20), ("TICKET_WEST", "STAIRS_WEST", 15),
    ("TICKET_WEST", "ESCALATOR_WEST", 15), ("TICKET_WEST", "LIFT_WEST", 18),
    ("STAIRS_WEST", "FOB_CENTRAL", 25), ("ESCALATOR_WEST", "FOB_CENTRAL", 25),
    ("LIFT_WEST", "FOB_CENTRAL", 30), ("EXIT_WEST", "TICKET_WEST", 20),
    ("RPF_WEST", "ENTRY_WEST", 10),

    # East-side vertical circulation -> FOB_CENTRAL / EAST_SKYWALK
    ("ENTRY_EAST", "TICKET_EAST", 20), ("TICKET_EAST", "STAIRS_EAST", 15),
    ("TICKET_EAST", "ESCALATOR_EAST", 15), ("TICKET_EAST", "LIFT_EAST", 18),
    ("STAIRS_EAST", "FOB_CENTRAL", 30), ("ESCALATOR_EAST", "FOB_CENTRAL", 30),
    ("LIFT_EAST", "FOB_CENTRAL", 35), ("EXIT_EAST", "TICKET_EAST", 20),
    ("RPF_EAST", "ENTRY_EAST", 10), ("TICKET_EAST", "EAST_SKYWALK", 40),

    # FOB spine connects to platform clusters (north to south)
    ("FOB_NORTH", "PF1", 20), ("FOB_NORTH", "PF2", 25), ("FOB_NORTH", "PF3", 30),
    ("FOB_NORTH", "PF4", 35), ("FOB_NORTH", "PF5", 45), ("FOB_NORTH", "FOB_CENTRAL", 60),

    ("FOB_CENTRAL", "PF4", 30), ("FOB_CENTRAL", "PF5", 20), ("FOB_CENTRAL", "PF6", 20),
    ("FOB_CENTRAL", "PF7", 25), ("FOB_CENTRAL", "PF8", 30), ("FOB_CENTRAL", "PF9", 35),
    ("FOB_CENTRAL", "PF9A", 38), ("FOB_CENTRAL", "PF10", 42), ("FOB_CENTRAL", "FOB_SOUTH", 60),
    ("FOB_CENTRAL", "EAST_SKYWALK", 50),

    ("FOB_SOUTH", "PF9", 25), ("FOB_SOUTH", "PF10", 20), ("FOB_SOUTH", "PF11", 20),
    ("FOB_SOUTH", "PF12", 25), ("FOB_SOUTH", "FOB_BMC", 40),

    ("FOB_BMC", "PF11", 30), ("FOB_BMC", "PF12", 20), ("FOB_BMC", "PF13", 20),
    ("FOB_BMC", "PF14", 25),

    ("EAST_SKYWALK", "PF9", 30), ("EAST_SKYWALK", "PF10", 25), ("EAST_SKYWALK", "PF11", 25),

    # Shortcut: short stairwell direct from FOB_CENTRAL to PF11 area.
    # Shorter distance than the FOB_CENTRAL->EAST_SKYWALK->PF11 bridge route,
    # but stairs get disproportionately crowded at rush hour -> creates a
    # genuine distance-vs-crowd trade-off for the demo.
    ("FOB_CENTRAL", "STAIRS_SOUTH", 35), ("STAIRS_SOUTH", "PF11", 35),
]

import os

# ---------------------------------------------------------------------------
# 2. LOAD CROWD MODEL (must be in the same folder as this script)
# ---------------------------------------------------------------------------
_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "crowd_model.pkl")
model = joblib.load(_MODEL_PATH)

def infer_zone_props(zone_id):
    if zone_id.startswith("PF"):
        if zone_id in ("PF5", "PF11"): return ("platform", 600)
        if zone_id in ("PF1","PF2","PF3","PF4"): return ("platform", 350)
        return ("platform", 480)
    if zone_id.startswith("FOB") or zone_id == "EAST_SKYWALK": return ("bridge", 280)
    if zone_id.startswith("ENTRY"): return ("entry", 500)
    if zone_id.startswith("EXIT"): return ("exit", 500)
    if zone_id.startswith("TICKET"): return ("facility", 200)
    if zone_id.startswith("STAIRS"): return ("staircase", 150)
    if zone_id.startswith("ESCALATOR"): return ("staircase", 180)
    if zone_id.startswith("LIFT"): return ("facility", 40)
    if zone_id.startswith("RPF"): return ("facility", 100)
    return ("facility", 200)

# Rebuild the exact one-hot columns the model was trained on
TRAIN_COLS = model.feature_names_in_.tolist()

def predict_crowd(zone_id, hour, day_of_week, mins_to_next_train=5, is_festival=0):
    ztype, base_cap = infer_zone_props(zone_id)
    row = {
        "hour": hour, "day_of_week": day_of_week,
        "is_weekend": int(day_of_week >= 5), "is_festival": is_festival,
        "mins_to_next_train": mins_to_next_train, "base_capacity": base_cap,
    }
    for col in TRAIN_COLS:
        if col.startswith("zone_id_"):
            row[col] = 1 if col == f"zone_id_{zone_id}" else 0
        elif col.startswith("zone_type_"):
            row[col] = 1 if col == f"zone_type_{ztype}" else 0
        elif col not in row:
            row[col] = 0
    df_row = pd.DataFrame([row])[TRAIN_COLS]
    return float(model.predict(df_row)[0])

# ---------------------------------------------------------------------------
# 3. BUILD GRAPH + DIJKSTRA WITH CROWD-WEIGHTED COST
# ---------------------------------------------------------------------------
graph = {}
for a, b, dist in EDGES:
    graph.setdefault(a, []).append((b, dist))
    graph.setdefault(b, []).append((a, dist))

def crowd_weighted_dijkstra(start, end, hour, day_of_week, mins_to_next_train=5,
                             crowd_weight=2.5, is_festival=0):
    """
    crowd_weight: how much crowd % matters vs raw distance.
    Higher = model avoids crowds more aggressively even if path is longer.
    """
    pq = [(0, start, [start])]
    visited = set()
    while pq:
        cost, node, path = heapq.heappop(pq)
        if node == end:
            return cost, path
        if node in visited:
            continue
        visited.add(node)
        for neighbor, dist in graph.get(node, []):
            if neighbor in visited:
                continue
            crowd_pct = predict_crowd(neighbor, hour, day_of_week, mins_to_next_train, is_festival)
            edge_cost = dist + crowd_pct * crowd_weight
            heapq.heappush(pq, (cost + edge_cost, neighbor, path + [neighbor]))
    return None, None

# ---------------------------------------------------------------------------
# 4. DEMO — PF5 -> PF11 at rush hour vs off-peak
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("=== Route: PF5 -> PF11 ===\n")

    for label, hour, dow, mins in [
        ("WEEKDAY RUSH (8:30am, Tue, train in 2 min)", 8, 1, 2),
        ("OFF-PEAK (2:00pm, Tue, train in 8 min)", 14, 1, 8),
    ]:
        cost, path = crowd_weighted_dijkstra("PF5", "PF11", hour, dow, mins)
        print(f"{label}")
        print(f"  Path: {' -> '.join(path)}")
        print(f"  Total cost: {cost:.1f}\n")

    # Compare: distance-only route (no crowd weighting) for contrast
    def distance_only_dijkstra(start, end):
        pq = [(0, start, [start])]
        visited = set()
        while pq:
            cost, node, path = heapq.heappop(pq)
            if node == end:
                return cost, path
            if node in visited:
                continue
            visited.add(node)
            for neighbor, dist in graph.get(node, []):
                if neighbor not in visited:
                    heapq.heappush(pq, (cost + dist, neighbor, path + [neighbor]))
        return None, None

    dcost, dpath = distance_only_dijkstra("PF5", "PF11")
    print(f"DISTANCE-ONLY (no crowd weighting) baseline:")
    print(f"  Path: {' -> '.join(dpath)}")
    print(f"  Total distance: {dcost:.1f}m")
