from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from movie_recommender.router import router as movie_router
from placement_predictor.router import router as placement_router

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Unified Portfolio Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://harrsh-here.netlify.app",
        "http://localhost:5173"  # Kept for local frontend testing
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movie_router)
app.include_router(placement_router)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

@app.get("/health")
def health_check():
    return {"status": "healthy", "services": ["Movie Recommender", "Placement Predictor"]}

@app.get("/")
async def serve_frontend():
    return FileResponse(str(BASE_DIR / "static" / "index.html"))

app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
