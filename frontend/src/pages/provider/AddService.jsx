import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService } from '../../services/serviceService';
import './AddService.css';

const AddService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createService(formData);
      navigate('/provider/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-service-container">
      <div className="form-card">
        <h1>Add New Service</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Service Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g., Plumber, Electrician" />
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="1" />
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} required placeholder="e.g., 2 hours" />
            </div>
          </div>
          <div className="form-group">
            <label>Service Area (Location) *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="City or area name" />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating...' : 'Create Service'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddService;