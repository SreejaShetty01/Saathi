from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

load_dotenv()
from app.api.shopping import router as shopping_router
from app.api.travel import router as travel_router
from app.api.food import router as food_router
from app.api.ai import router as ai_router

app = FastAPI(title="Saathi API", version="1.0.0")

# Allow frontend later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serving Frontend files
app.mount("/Frontend", StaticFiles(directory="Frontend"), name="Frontend")

@app.get("/")
def home():
    return {
        "name": "Saathi",
        "status": "alive",
        "message": "Your smart companion is running",
        "frontend": "/Frontend/index.html"
    }

@app.get("/health")
def health():
    return {"status": "ok"}
app.include_router(shopping_router)
app.include_router(travel_router)
app.include_router(food_router)
app.include_router(ai_router)

