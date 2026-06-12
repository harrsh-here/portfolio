from fastapi import APIRouter, HTTPException
import os
import httpx
from pydantic import BaseModel
from typing import List, Optional
from movie_recommender import dataset

router = APIRouter()

class RecommendRequest(BaseModel):
    movie_title: str
    num_recommendations: Optional[int] = 6

class MovieInfo(BaseModel):
    id: int
    title: str
    genres: List[str]
    average_rating: float

class RecommendResponse(BaseModel):
    recommendations: List[MovieInfo]

@router.get("/movies", response_model=List[str])
def list_movies():
    return dataset.get_all_movies()

@router.post("/recommend", response_model=RecommendResponse)
def recommend(payload: RecommendRequest):
    recs = dataset.get_recommendations(payload.movie_title, payload.num_recommendations)
    if recs is None:
        raise HTTPException(status_code=404, detail="Movie not found in the dataset index")
    return {"recommendations": recs}

OMDB_URL = "https://www.omdbapi.com/"

@router.get("/omdb")
async def omdb_proxy(t: str):
    key = os.environ.get("OMDB_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="OMDB_KEY not configured")
    try:
        params = {"t": t, "apikey": key}
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(OMDB_URL, params=params)
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail="OMDb fetch failed")
        return r.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
