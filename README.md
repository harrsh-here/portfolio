# Portfolio Monorepo

This repository contains the frontend portfolio website and the backend APIs used within the portfolio.

## Folder Structure

- `frontend/`: The React/Vite application for the portfolio website.
- `backend/student-placement-predictor/`: The Flask API for the Student Placement Predictor.

## Deployment Strategy

- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on Railway.

## Environment Variables

For local development, copy `frontend/.env.example` to `frontend/.env` and add your API keys.

- `VITE_OMDB_API_KEY`: Required for fetching movie poster details.
- `VITE_MOVIE_API_URL`: URL of your movie recommender API.
- `VITE_PLACEMENT_API_URL`: URL of your student placement predictor API.
