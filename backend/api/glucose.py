from typing import List
from fastapi import APIRouter
from models.glucose import load_glucose_sample
from pydantic import BaseModel


# Define a Pydantic model for a single glucose reading
class GlucoseReading(BaseModel):
    date: str
    time: str
    glucose: float


glucose_router = APIRouter(prefix="/glucose", tags=["Glucose"])


@glucose_router.get("/")
def root():
    return {"message": "Hello, Glucose!"}


@glucose_router.get("/sample", response_model=List[GlucoseReading])
def get_sample():
    data = load_glucose_sample()
    dates, times, glucose_values = data["date"], data["time"], data["glucose"]
    # Zip the three lists together and return a list of GlucoseReading objects.
    return [
        GlucoseReading(date=d, time=t, glucose=g)
        for d, t, g in zip(dates, times, glucose_values)
    ]


@glucose_router.get("/sample_current", response_model=GlucoseReading)
def get_sample_current():
    data = load_glucose_sample()
    data = data['glucose'][:453]
    return [
        GlucoseReading(date=d, time=t, glucose=g)
        for d, t, g in zip(data["date"], data["time"], data["glucose"])
    ]


@glucose_router.get("/sample_prediction_heavy", response_model=GlucoseReading)
def get_sample_prediction_heavy():
    data = load_glucose_sample()
    data = data['glucose'][453:550]
    return [
        GlucoseReading(date=d, time=t, glucose=g)
        for d, t, g in zip(data["date"], data["time"], data["glucose"])
    ]


@glucose_router.get("/sample_prediction_medium", response_model=GlucoseReading)
def get_sample_prediction_medium():
    data = load_glucose_sample()
    data = (data['glucose'][453:550] - data['glucose'][453]) * 0.5 + data['glucose'][453]
    return [
        GlucoseReading(date=d, time=t, glucose=g)
        for d, t, g in zip(data["date"], data["time"], data["glucose"])
    ]


@glucose_router.get("/sample_prediction_light", response_model=GlucoseReading)
def get_sample_prediction_light():
    data = load_glucose_sample()
    data = (data['glucose'][453:550] - data['glucose'][453]) * 0.2 + data['glucose'][453]
    return [
        GlucoseReading(date=d, time=t, glucose=g)
        for d, t, g in zip(data["date"], data["time"], data["glucose"])
    ]
