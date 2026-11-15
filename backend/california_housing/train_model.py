"""
Train and save the California Housing model.
Run this once: python train_model.py
"""
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Load dataset
data = fetch_california_housing()
X, y = data.data, data.target  # target is in $100k units

# Use the 3 best features (matching the portfolio experiments):
# 0: MedInc, 1: HouseAge, 4: AveRooms equivalent → use indices 0,1,5
# Full feature list: MedInc, HouseAge, AveRooms, AveBedrms, Population, AveOccup, Latitude, Longitude
# We expose all 8 for a richer interactive experience
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

model = LinearRegression()
model.fit(X_train_scaled, y_train)

joblib.dump(model, BASE_DIR / 'model.pkl')
joblib.dump(scaler, BASE_DIR / 'scaler.pkl')

# Save feature names and ranges for frontend hints
import json
feature_info = {
    "features": [
        {"name": "MedInc", "label": "Median Income", "unit": "($10k)", "min": round(float(X[:,0].min()), 2), "max": round(float(X[:,0].max()), 2), "mean": round(float(X[:,0].mean()), 2)},
        {"name": "HouseAge", "label": "House Age", "unit": "(years)", "min": round(float(X[:,1].min()), 2), "max": round(float(X[:,1].max()), 2), "mean": round(float(X[:,1].mean()), 2)},
        {"name": "AveRooms", "label": "Avg Rooms", "unit": "", "min": round(float(X[:,2].min()), 2), "max": round(float(X[:,2].max()), 2), "mean": round(float(X[:,2].mean()), 2)},
        {"name": "AveBedrms", "label": "Avg Bedrooms", "unit": "", "min": round(float(X[:,3].min()), 2), "max": round(float(X[:,3].max()), 2), "mean": round(float(X[:,3].mean()), 2)},
        {"name": "Population", "label": "Population", "unit": "", "min": round(float(X[:,4].min()), 2), "max": round(float(X[:,4].max()), 2), "mean": round(float(X[:,4].mean()), 2)},
        {"name": "AveOccup", "label": "Avg Occupants", "unit": "", "min": round(float(X[:,5].min()), 2), "max": round(float(X[:,5].max()), 2), "mean": round(float(X[:,5].mean()), 2)},
        {"name": "Latitude", "label": "Latitude", "unit": "(°N)", "min": round(float(X[:,6].min()), 2), "max": round(float(X[:,6].max()), 2), "mean": round(float(X[:,6].mean()), 2)},
        {"name": "Longitude", "label": "Longitude", "unit": "(°W)", "min": round(float(X[:,7].min()), 2), "max": round(float(X[:,7].max()), 2), "mean": round(float(X[:,7].mean()), 2)},
    ]
}
with open(BASE_DIR / 'feature_info.json', 'w') as f:
    json.dump(feature_info, f, indent=2)

X_test_scaled = scaler.transform(X_test)
score = model.score(X_test_scaled, y_test)
print(f"Model trained. Test R²: {score:.4f}")
print(f"Saved model.pkl, scaler.pkl, feature_info.json to {BASE_DIR}")
