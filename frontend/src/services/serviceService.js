import api from './api';

// Get all services (public, with filters)
export const getAllServices = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/services${params ? `?${params}` : ''}`);
  return response.data;
};

// Get single service by ID
export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

// Create a new service (provider only)
export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

// Update a service (provider owner only)
export const updateService = async (id, serviceData) => {
  const response = await api.put(`/services/${id}`, serviceData);
  return response.data;
};

// Delete a service (provider owner only)
export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// Get services for logged-in provider (uses backend endpoint /services/my)
export const getProviderServices = async () => {
  const response = await api.get('/services/my');
  return response.data;
};