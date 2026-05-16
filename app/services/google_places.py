import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
BASE_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo"

def search_restaurants(query: str):
    if not API_KEY:
        return {"error": "API Key not configured"}
    
    params = {
        "query": query,
        "location": "17.3850,78.4867", # Default to Hyderabad as per user's test code
        "radius": "3000",
        "key": API_KEY,
        "type": "restaurant"
    }
    
    try:
        response = requests.get(BASE_URL, params=params)
        data = response.json()
        
        if data.get("status") != "OK":
            return {"error": data.get("status", "Unknown error"), "results": []}
        
        results = []
        for place in data.get("results", []):
            photo_ref = None
            if place.get("photos"):
                photo_ref = place["photos"][0]["photo_reference"]
            
            results.append({
                "name": place.get("name"),
                "rating": place.get("rating"),
                "address": place.get("formatted_address"),
                "photo_reference": photo_ref,
                "place_id": place.get("place_id")
            })
        
        return {"results": results}
    except Exception as e:
        return {"error": str(e), "results": []}

def get_photo_url(photo_reference: str, max_width: int = 400):
    if not API_KEY or not photo_reference:
        return None
    return f"{PHOTO_URL}?maxwidth={max_width}&photoreference={photo_reference}&key={API_KEY}"
