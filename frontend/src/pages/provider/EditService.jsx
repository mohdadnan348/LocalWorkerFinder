import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, updateService } from '../../services/serviceService';
import './EditService.css';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    location: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await getServiceById(id);
      const service = res.data;
      setFormData({
        name: service.name,
        category: service.category,
        description: service.description,
        price: service.price,
        duration: service.duration,
        location: service.location,
        isActive: service.isActive,
      });
    } catch (err) {
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateService(id, formData);
      navigate('/provider/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="edit-service-container loading-state">Loading...</div>;

  return (
    <div className="edit-service-container">
      <div className="form-card">
        <h1>Edit Service</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Service Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
              Service Active (visible to customers)
            </label>
          </div>
          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditService;