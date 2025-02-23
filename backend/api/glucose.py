from typing import List
from fastapi import APIRouter
from models.glucose import get_glucose_data
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
def get_glucose_levels():
    dates, times, glucose_values = get_glucose_data()
    # Zip the three lists together and return a list of GlucoseReading objects.
    return [
        GlucoseReading(date=d, time=t, glucose=g)
        for d, t, g in zip(dates, times, glucose_values)
    ]
