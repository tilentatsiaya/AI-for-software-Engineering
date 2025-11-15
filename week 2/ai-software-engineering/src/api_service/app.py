from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "model.pkl")
MODEL_PATH = os.path.abspath(MODEL_PATH)

class InputData(BaseModel):
    # adapt fields to your training features
    temperature: float
    humidity: float
    rainfall: float
    population_density: float
    sanitation_score: float
    previous_cases: float
    vaccination_rate: float
    healthcare_access: float

app = FastAPI()
model = None

@app.on_event("startup")
def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Model not found at {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)

@app.post("/predict")
def predict(payload: InputData):
    try:
        x = np.array([[payload.temperature, payload.humidity, payload.rainfall,
                       payload.population_density, payload.sanitation_score,
                       payload.previous_cases, payload.vaccination_rate,
                       payload.healthcare_access]])
        proba = model.predict_proba(x)[0].tolist() if hasattr(model, "predict_proba") else [float(model.predict(x)[0])]
        # return stubbed structured output
        risk_probability = proba[-1] if len(proba) > 1 else proba[0]
        return {
            "risk_level": "High Risk" if risk_probability > 0.6 else ("Medium Risk" if risk_probability > 0.3 else "Low Risk"),
            "confidence": 0.8,
            "risk_probability": float(risk_probability),
            "recommendations": {
                "alert_level": "High" if risk_probability > 0.6 else "Normal",
                "recommendations": ["Increase surveillance", "Public awareness", "Targeted vaccination"],
                "immediate_actions": ["Isolate cases", "Deploy response teams"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))