import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

DATA_FILE = "dadar_crowd_prototype_calibrated.csv"
MODEL_FILE = "crowd_model.pkl"

TARGET = "crowd_score"

NUMERIC = [
    "hour",
    "day_of_week",
    "is_weekend",
    "is_festival",
    "mins_to_next_train",
    "base_capacity",
]

CATEGORICAL = ["zone_id", "zone_type"]


def main():
    df = pd.read_csv(DATA_FILE)

    required = NUMERIC + CATEGORICAL + [TARGET]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns: {missing}")

    X = pd.get_dummies(df[NUMERIC + CATEGORICAL], columns=CATEGORICAL)
    y = df[TARGET].astype(float)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, pred)
    rmse = mean_squared_error(y_test, pred) ** 0.5
    r2 = r2_score(y_test, pred)

    print("\n=== CROWD MODEL EVALUATION ===")
    print(f"MAE : {mae:.2f} percentage points")
    print(f"RMSE: {rmse:.2f} percentage points")
    print(f"R²  : {r2:.3f}")

    # Keep the exact columns required at inference time.
    model.feature_names_in_ = X.columns.to_numpy()
    joblib.dump(model, MODEL_FILE)

    print(f"\nSaved: {MODEL_FILE}")
    print(f"Features: {len(X.columns)}")


if __name__ == "__main__":
    main()
