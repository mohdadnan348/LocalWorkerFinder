import React, { useState, useEffect } from 'react';
import { getAllServicesAdmin, deleteServiceAdmin } from '../../services/adminService';
import './AllServices.css';

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getAllServicesAdmin();
      setServices(res.data);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service? This action cannot be undone.')) {
      try {
        await deleteServiceAdmin(id);
        setServices(services.filter(s => s._id !== id));
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const filteredServices = categoryFilter
    ? services.filter(s => s.category.toLowerCase().includes(categoryFilter.toLowerCase()))
    : services;

  const categories = [...new Set(services.map(s => s.category))];

  if (loading) return <div className="all-services">Loading...</div>;
  if (error) return <div className="all-services error">{error}</div>;

  return (
    <div className="all-services">
      <h1>All Services (Platform)</h1>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter by category..."
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        {categoryFilter && (
          <button onClick={() => setCategoryFilter('')}>Clear</button>
        )}
      </div>
      {filteredServices.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="services-grid">
          {filteredServices.map(service => (
            <div key={service._id} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <span className="category">{service.category}</span>
              </div>
              <p className="description">{service.description}</p>
              <div className="service-details">
                <span>💰 ₹{service.price}</span>
                <span>⏱️ {service.duration}</span>
                <span>📍 {service.location}</span>
                <span>👤 Provider: {service.providerId?.userId?.name || 'Unknown'}</span>
              </div>
              <div className="service-status">
                <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button onClick={() => handleDelete(service._id)} className="delete-btn">
                Delete Service
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllServices;