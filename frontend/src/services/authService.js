import api from './api';

// Login user
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Register user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Get current user profile
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};