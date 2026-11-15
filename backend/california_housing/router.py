from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path

router = APIRouter(prefix="/california", tags=["California Housing"])

BASE_DIR = Path(__file__).resolve().parent

model = joblib.load(BASE_DIR / 'model.pkl')
scaler = joblib.load(BASE_DIR / 'scaler.pkl')

class HousingRequest(BaseModel):
    med_inc: float = 3.5       # Median Income ($10k)
    house_age: float = 20.0    # House Age (years)
    ave_rooms: float = 5.0     # Average Rooms
    ave_bedrms: float = 1.0    # Average Bedrooms
    population: float = 1200.0 # Population
    ave_occup: float = 3.0     # Average Occupants
    latitude: float = 35.5     # Latitude
    longitude: float = -119.5  # Longitude

class HousingResponse(BaseModel):
    price_usd: float
    price_100k: float

@router.post("/predict", response_model=HousingResponse)
def predict_housing(data: HousingRequest):
    try:
        features = np.array([[
            data.med_inc, data.house_age, data.ave_rooms, data.ave_bedrms,
            data.population, data.ave_occup, data.latitude, data.longitude
        ]])
        scaled = scaler.transform(features)
        price_100k = float(model.predict(scaled)[0])
        # Clamp to realistic range ($50k - $5M)
        price_100k = max(0.5, min(price_100k, 50.0))
        return {"price_100k": round(price_100k, 4), "price_usd": round(price_100k * 100_000, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
