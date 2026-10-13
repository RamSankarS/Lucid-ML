from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# explainer singleton
from app.ml.explainer import cosmic_explainer

app = FastAPI(
    title="Cosmic XAI Engine", 
    description="Real-time Explainable AI for NASA Near-Earth Object Classification",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schema for Input Validation

class AsteroidTelemetry(BaseModel):
    absolute_magnitude: float = Field(..., description="Absolute magnitude (luminosity)", ge=10, le=35)
    est_diameter_max: float = Field(..., description="Maximum estimated diameter in km", ge=0.0)
    relative_velocity: float = Field(..., description="Relative velocity in km/h", ge=0.0)
    miss_distance: float = Field(..., description="Miss distance from Earth in km", ge=0.0)

# API Routes

@app.get("/api/v1/health")
async def health_check():
    return {"status": "active", "system": "Cosmic XAI Backend Engine", "version": "1.0.0"}

@app.post("/api/v1/predict")
async def predict_hazard(telemetry: AsteroidTelemetry):
    # Convert Pydantic model to a standard Python dictionary
    input_dict = telemetry.model_dump()
    
    # Pass the validated data to the explainer service
    result = cosmic_explainer.predict_and_explain(input_dict)
    
    return result