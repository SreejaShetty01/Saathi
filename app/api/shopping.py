from fastapi import APIRouter
from app.services.shopping_engine import get_platform_deals

router = APIRouter(prefix="/shopping", tags=["Shopping"])

@router.get("/compare")
def compare_shopping(q: str):
    return get_platform_deals(q)

@router.get("/amazon")
def amazon_price(url: str):
    # Deprecated but kept to avoid breaking main.py if it expects it
    return {"error": "Use /compare?q=product_name instead"}
