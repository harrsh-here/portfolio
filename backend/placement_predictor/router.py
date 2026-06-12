from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent

# Load model and scaler once at startup
model = joblib.load(BASE_DIR / 'model.pkl')
scaler = joblib.load(BASE_DIR / 'scaler.pkl')

class PredictRequest(BaseModel):
    cgpa: float = 0.0
    iq: int = 0

class PredictResponse(BaseModel):
    result: str
    confidence: float

@router.post('/predict', response_model=PredictResponse)
def predict(data: PredictRequest):
    try:
        features = np.array([[data.cgpa, data.iq]])
        scaled = scaler.transform(features)
        prediction = model.predict(scaled)[0]
        probability = model.predict_proba(scaled)[0]

        result = 'Placed' if prediction == 1 else 'Not Placed'
        confidence = float(max(probability))

        return {"result": result, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
