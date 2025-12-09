import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'fb4ab5573c1a91308114571245861546';


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
