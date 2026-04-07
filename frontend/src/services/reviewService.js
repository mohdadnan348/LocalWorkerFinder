import api from './api';

// Add a review (customer only, after completed booking)
export const addReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

// Get all reviews for a provider (public)
export const getProviderReviews = async (providerId) => {
  const response = await api.get(`/reviews/provider/${providerId}`);
  return response.data;
};

// ✅ Get all reviews for a specific service (public)
export const getServiceReviews = async (serviceId) => {
  const response = await api.get(`/reviews/service/${serviceId}`);
  return response.data;
};

// ✅ Check if customer can review a specific booking
export const checkCanReview = async (bookingId) => {
  const response = await api.get(`/reviews/check/${bookingId}`);
  return response.data;
};

// ✅ Get all reviews (admin only)
export const getAllReviews = async () => {
  const response = await api.get('/admin/reviews');
  return response.data;
};

// ✅ Delete a review (admin only)
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/admin/reviews/${reviewId}`);
  return response.data;
};