import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_AI_API_KEY")
MODEL = "gemini-1.5-flash"
BASE_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

def generate_insight(domain: str, query: str):
    if not API_KEY:
        return {"insight": "Saathi is currently optimizing its intelligence. Check back shortly!", "confidence": "medium"}
    
    prompt = f"""
    You are Saathi, a calm and intelligent shopping, travel, and food companion.
    User is searching for '{query}' in the '{domain}' category.
    Generate a one-sentence, calm, product-like insight.
    - Shopping: focus on price trends or launch cycles.
    - Travel: focus on peak hour patterns or route behavior.
    - Food: focus on demand timing or surge hints.
    Example Shopping: 'Prices for this model usually drop by 15% during seasonal sales in October.'
    Return ONLY the insight text.
    """

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    try:
        response = requests.post(f"{BASE_URL}?key={API_KEY}", json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        insight = data['candidates'][0]['content']['parts'][0]['text'].strip()
        # Simple heuristic for confidence; in a real app this might be driven by logic or AI
        confidence = "high" if len(insight) > 20 else "medium"
        
        return {"insight": insight, "confidence": confidence}
    except Exception as e:
        print(f"AI Insight error: {e}")
        return {"insight": "Saathi suggests monitoring price trends for better deals.", "confidence": "medium"}
