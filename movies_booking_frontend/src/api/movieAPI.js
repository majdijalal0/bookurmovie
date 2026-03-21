import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;


export async function fetchMovies(path,page=1) {
  try {
    const response = await axios.get(`${BASE_URL}${path}`, {
      params: {
        api_key: API_KEY,
        page: page
      },
    });

    return response.data.results || [];
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw err;
  }
}

export async function fetchMovieDetail(id) {
  try {
    const path = `/movie/${id}`; 
    const response = await axios.get(`${BASE_URL}${path}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data; 
  } catch (err) {
    console.error(`Error fetching movie details for ID ${id}:`, err);
    throw err;
  }
}

export async function fetchGenres(path) {
  try {
    const response = await axios.get(`${BASE_URL}${path}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.genres || [];
  } catch (err) {
    console.error("Error fetching genres:", err);
    throw err;
  }
}
