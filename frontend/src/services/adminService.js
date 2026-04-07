import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Dashboard stats
export const getAdminStats = async () => {
  const res = await axios.get(`${API_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data; // expects { success, data }
};

// Users
export const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data; // { success, data: usersArray }
};

export const blockUser = async (userId, isBlocked) => {
  const res = await axios.put(`${API_URL}/users/${userId}/block`, { isBlocked }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

// Providers
export const getAllProviders = async () => {
  const res = await axios.get(`${API_URL}/providers`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const approveProvider = async (providerId, isBlocked) => {
  const res = await axios.put(`${API_URL}/providers/${providerId}/approve`, { isBlocked }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

// Bookings
export const getAllBookings = async () => {
  const res = await axios.get(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const updateBookingStatusAdmin = async (bookingId, status) => {
  const res = await axios.put(`${API_URL}/bookings/${bookingId}/status`, { status }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

// Services (admin)
export const getAllServicesAdmin = async () => {
  const res = await axios.get(`${API_URL}/services`, {  // adjust route if needed
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const deleteServiceAdmin = async (serviceId) => {
  const res = await axios.delete(`${API_URL}/services/${serviceId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};