import api from './api';

// Create a new booking (customer)
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

// Get user's bookings (role-based: customer gets own, provider gets assigned)
export const getUserBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

// Get provider's bookings (alias for getUserBookings when role=provider)
export const getProviderBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

// Update booking status (provider/admin)
export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.put(`/bookings/${bookingId}/status`, { status });
  return response.data;
};

// Cancel booking (customer, only pending)
export const cancelBooking = async (bookingId) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};