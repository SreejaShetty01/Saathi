from fastapi import APIRouter
from app.services.travel_engine import calculate_travel_prices

router = APIRouter(prefix="/travel", tags=["Travel"])

@router.get("/compare")
def compare_travel(pickup: str, drop: str):
    return calculate_travel_prices(pickup, drop)
