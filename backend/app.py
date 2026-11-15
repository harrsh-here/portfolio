import os

# ── ZeroGPU no-op (required on free HF ZeroGPU Spaces) ──────────────────────
try:
    import spaces
    @spaces.GPU(duration=1)
    def _noop():
        pass
except (ImportError, Exception):
    pass

# ── FastAPI (primary app) ────────────────────────────────────────────────────
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from movie_recommender.router import router as movie_router
from placement_predictor.router import router as placement_router
from california_housing.router import router as california_router

app = FastAPI(title="Harrsh Portfolio Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movie_router)
app.include_router(placement_router)
app.include_router(california_router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "services": ["Movie Recommender", "Placement Predictor", "California Housing"],
    }

@app.get("/")
def root():
    return {
        "message": "Harrsh Portfolio Backend",
        "endpoints": ["/health", "/movies", "/recommend", "/omdb", "/predict", "/california/predict"],
        "docs": "/docs",
        "gradio_ui": "/gradio",
    }

# ── Gradio UI (mounted at /gradio so its SSR never intercepts API routes) ────
import gradio as gr

with gr.Blocks(title="Harrsh Portfolio Backend") as demo:
    gr.Markdown(
        """
        # 🚀 Portfolio Backend API
        FastAPI ML backend for [Harrsh's Portfolio](https://harrsh.netlify.app).

        | Endpoint | Method | Description |
        |---|---|---|
        | `/health` | GET | Health check |
        | `/movies` | GET | List all movies |
        | `/recommend` | POST | Get movie recommendations |
        | `/omdb` | GET | OMDb poster proxy |
        | `/predict` | POST | Student placement prediction |
        | `/california/predict` | POST | California housing price |

        **[📖 API Docs](/docs)** · **[🔍 Redoc](/redoc)**
        """
    )

# Mount Gradio under /gradio — keeps SSR away from the API routes above
app = gr.mount_gradio_app(app, demo, path="/gradio")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
