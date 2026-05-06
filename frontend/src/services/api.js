import axios from 'axios';

export const API_URL = 'https://cinephelia-backend.onrender.com';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const getMovies = async () => {
  try {
    const res = await axios.get(`/api/movies`);
    return res.data.movies || res.data;
  } catch (error) {
    console.error('Backend unavailable or failed to fetch movies', error);
    return [];
  }
};

export const getMovieById = async (id) => {
  try {
    const res = await axios.get(`/api/movies/${id}`);
    return res.data;
  } catch (error) {
    console.error('Backend unavailable or failed to fetch movie detail', error);
    return null;
  }
};

export const getMovieShowtimes = async (id) => {
  try {
    const res = await axios.get(`/api/movies/${id}/showtimes`);
    return res.data;
  } catch (error) {
    console.warn('Failed to fetch showtimes from backend');
    return [];
  }
};

export const getAuthUser = async () => {
  const res = await axios.get('/api/auth/me');
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post('/api/auth/logout');
  return res.data;
};

export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_URL}/api/bookings`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create booking');
  }
  
  return await response.json();
};

export const getUserBookings = async () => {
  const res = await axios.get('/api/bookings');
  return res.data;
};

export const addMovie = async (movieData) => {
  const response = await fetch(`${API_URL}/api/movies`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to add movie');
  }
  
  return await response.json();
};

export const deleteMovie = async (id) => {
  const res = await axios.delete(`/api/movies/${id}`);
  return res.data;
};