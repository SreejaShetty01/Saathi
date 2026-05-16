import random

import random

# Structured Product Data
PRODUCT_DATA = {
    "electronics": {
        "platforms": ["Amazon", "Flipkart", "Croma"],
        "items": {
            "iphone 11": (35000, 45000),
            "iphone 12": (40000, 50000),
            "iphone 13": (50000, 60000),
            "iphone 14": (60000, 70000),
            "iphone 15": (70000, 85000),
            "iphone pro": (100000, 160000),
            "iphone": (35000, 160000),
            "samsung s": (40000, 100000),
            "samsung a": (15000, 30000),
            "oneplus": (25000, 60000),
            "redmi": (8000, 25000),
            "realme": (8000, 25000),
            "vivo": (12000, 35000),
            "oppo": (12000, 35000),
            "macbook air": (90000, 130000),
            "macbook pro": (150000, 250000),
            "dell": (40000, 90000),
            "hp": (40000, 90000),
            "lenovo": (40000, 90000),
            "gaming laptop": (70000, 150000),
            "laptop": (40000, 150000),
            "airpods": (10000, 25000),
            "boat": (500, 3000),
            "jbl": (2000, 20000),
            "sony": (2000, 20000),
            "refrigerator single door": (12000, 20000),
            "double door fridge": (25000, 50000),
            "washing machine": (15000, 40000),
            "microwave": (5000, 15000),
            "smart tv": (20000, 100000),
            "hair straightener": (800, 5000),
            "hair dryer": (700, 4000),
            "trimmer": (1000, 5000)
        }
    },
    "fashion": {
        "platforms": ["Myntra", "Ajio", "Meesho"],
        "items": {
            "kurti": (500, 1500),
            "kurta set": (1200, 4000),
            "saree": (1000, 8000),
            "dress": (1500, 5000),
            "skirt": (800, 3000),
            "tops": (400, 1500),
            "t-shirt": (300, 800),
            "casual shirt": (700, 2000),
            "formal shirt": (1200, 3000),
            "jeans": (1200, 3500),
            "tracks": (800, 2500),
            "hoodie": (900, 2500),
            "blazer": (3000, 8000),
            "formal wear": (3000, 8000)
        }
    },
    "accessories": {
        "platforms": ["Amazon", "Flipkart", "Meesho"],
        "items": {
            "smartwatch": (1500, 10000),
            "analog watch": (500, 5000),
            "watch": (500, 10000),
            "sunglasses": (300, 3000),
            "handbag": (800, 5000),
            "backpack": (700, 4000),
            "wallet": (200, 1500),
            "belt": (300, 1500),
            "cap": (200, 800)
        }
    }
}

def get_platform_deals(product_query: str):
    product_query = product_query.lower()
    category = "general"
    price_range = (500, 5000)
    platforms = ["Amazon", "Flipkart", "Meesho"]
    
    # 1. Detect Category and Specific Product Price
    matched = False
    for cat, data in PRODUCT_DATA.items():
        for item, p_range in data["items"].items():
            if item in product_query:
                category = cat
                price_range = p_range
                platforms = data["platforms"]
                matched = True
                break
        if matched: break

    # Fallback if no specific keyword matched but categories might
    if not matched:
        if any(x in product_query for x in ["phone", "electronics", "gadget", "laptop"]):
            category, platforms, price_range = "electronics", PRODUCT_DATA["electronics"]["platforms"], (1000, 50000)
        elif any(x in product_query for x in ["cloth", "wear", "shirt", "pant"]):
            category, platforms, price_range = "fashion", PRODUCT_DATA["fashion"]["platforms"], (500, 5000)

    base_price = random.randint(*price_range)
    results = []

    for platform in platforms:
        # 2. Platform Specific Logic
        modifier = random.uniform(0.95, 1.05)
        
        if category == "electronics" and platform == "Flipkart":
            modifier *= 0.96  # Flipkart slightly cheaper for electronics
        elif category == "fashion":
            if platform == "Myntra":
                modifier *= 1.1  # Myntra premium for fashion
            elif platform == "Meesho":
                modifier *= 0.85 # Meesho lowest budget

        current_price = int(base_price * modifier)
        
        # 3. Generate Price History
        lowest_ever = int(current_price * random.uniform(0.75, 0.95))
        peak_price = int(current_price * random.uniform(1.1, 1.4))
        
        # Recommendation
        if current_price < (lowest_ever * 1.1):
            recommendation = "Good time to buy"
        else:
            recommendation = "Wait for price drop"

        results.append({
            "platform": platform,
            "label": platform,
            "current_price": current_price,
            "lowest_ever": lowest_ever,
            "peak_price": peak_price,
            "recommendation": recommendation,
            "meta": "🔥 High Demand" if random.random() > 0.7 else "🚚 Free Delivery",
            "tag": None, # Will set Best Deal later
            "value": f"₹{current_price:,}"
        })

    # 4. Highlight Lowest Price as "Best Deal"
    results.sort(key=lambda x: x["current_price"])
    results[0]["tag"] = "Best Deal"
    
    best_platform = results[0]["platform"]
    insight = f"{best_platform} offers the best price for this {category.capitalize()} item. {results[0]['recommendation']}!"

    return {
        "product": product_query,
        "category": category,
        "deals": results,
        "insight": insight
    }

def fetch_amazon_price(url: str):
    return {"message": "Please use search for comparisons"}
