const DEFAULT_API_URL = 'https://harrshhere-portfolio-backend.hf.space';
const normalize = (url) => (url || DEFAULT_API_URL).trim().replace(/\/+$/, '');

export const MOVIE_API_URL = normalize(import.meta.env.VITE_MOVIE_API_URL);
export const PLACEMENT_API_URL = normalize(import.meta.env.VITE_PLACEMENT_API_URL);
export const HOUSING_API_URL = normalize(import.meta.env.VITE_API_URL);
