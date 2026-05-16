import random

BASE_RATES = {
    "uber": 14,
    "ola": 13,
    "rapido": 8  # Rapido is usually cheaper (bike/auto focus)
}

def estimate_distance():
    return random.randint(2, 20)

def surge_multiplier():
    hour = random.randint(8, 22)
    if 8 <= hour <= 10 or 17 <= hour <= 20:
        return random.uniform(1.4, 1.9)
    return random.uniform(1.0, 1.2)

def calculate_travel_prices(pickup: str, drop: str):
    distance = estimate_distance()
    surge = surge_multiplier()
    results = []

    for service, rate in BASE_RATES.items():
        price = int(distance * rate * surge + random.randint(5, 15))
        
        meta = "6 min away"
        tag = None
        if service == "rapido":
            meta = "3 min away • Bike"
            tag = "Cheapest"
        elif service == "uber":
            meta = "4 min away • Sedan"
            tag = "Comfort"
        
        results.append({
            "label": service.capitalize(),
            "meta": meta,
            "value": f"₹{price}",
            "tag": tag,
            "price": price
        })

    results.sort(key=lambda x: x["price"])
    best = results[0]["label"]

    return {
        "route": f"{pickup} to {drop}",
        "results": results,
        "best_option": best,
        "insight": f"{best} is your best bet for this route right now."
    }
