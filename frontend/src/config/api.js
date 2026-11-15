// Base URL of the ML backend (FastAPI on Hugging Face Spaces) that serves all model APIs.
// Override with VITE_BACKEND_URL if the backend moves.
const DEFAULT_BACKEND_URL = 'https://harrshhere-portfolio-backend.hf.space'

const fromEnv = (import.meta.env.VITE_BACKEND_URL || '').trim()

export const BACKEND_URL = (/^https?:\/\//.test(fromEnv) ? fromEnv : DEFAULT_BACKEND_URL).replace(/\/+$/, '')
