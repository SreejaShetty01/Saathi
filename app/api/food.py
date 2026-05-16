from fastapi import APIRouter
from app.services.food_engine import estimate_food_prices
from app.services.google_places import search_restaurants, get_photo_url

router = APIRouter(prefix="/food", tags=["Food"])

@router.get("/compare")
def compare_food(item: str, base_price: int = 150):
    return estimate_food_prices(item, base_price)

@router.get("/restaurants")
def get_restaurants(q: str):
    data = search_restaurants(q)
    # Add photo URLs to results
    for res in data.get("results", []):
        if res.get("photo_reference"):
            res["photo_url"] = get_photo_url(res["photo_reference"])
    return data
