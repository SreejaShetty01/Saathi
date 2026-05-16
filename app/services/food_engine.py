import random

BASE_PRICES = {
    "swiggy": 1.0,
    "zomato": 1.05
}

def demand_multiplier():
    """Simulate meal-time demand"""
    hour = random.randint(11, 23)  # Focused on active hours
    if 12 <= hour <= 14 or 19 <= hour <= 21:
        return random.uniform(1.2, 1.4)
    return random.uniform(1.0, 1.15)

def delivery_fee():
    return random.randint(20, 50)

def estimate_food_prices(item: str, base_cost: int = 150):
    demand = demand_multiplier()
    results = []

    for platform, multiplier in BASE_PRICES.items():
        price = int(base_cost * multiplier * demand + delivery_fee())
        meta = "4.2★ • 30 mins" if platform == "swiggy" else "4.4★ • 25 mins"
        tag = "Best Value" if random.random() > 0.5 else None
        
        results.append({
            "label": platform.capitalize(),
            "meta": meta,
            "value": f"₹{price}",
            "tag": tag,
            "price": price
        })

    results.sort(key=lambda x: x["price"])
    best = results[0]["label"]

    return {
        "item": item,
        "results": results,
        "best_option": best,
        "insight": f"{best} is offering the best price for {item} right now."
    }
