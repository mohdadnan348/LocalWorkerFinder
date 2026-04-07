import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProviderServices, deleteService } from '../../services/serviceService';
import './ManageServices.css';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getProviderServices();
      setServices(res.data);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        setServices(services.filter(s => s._id !== id));
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const toggleActive = async (service) => {
    try {
      const { updateService } = await import('../../services/serviceService');
      await updateService(service._id, { isActive: !service.isActive });
      fetchServices();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="manage-services loading-state">Loading services...</div>;
  if (error) return <div className="manage-services error-state">{error}</div>;

  return (
    <div className="manage-services">
      <div className="header-actions">
        <h1>My Services</h1>
        <Link to="/provider/services/add" className="add-btn">+ Add New Service</Link>
      </div>
      {services.length === 0 ? (
        <p className="empty-state">No services added yet. <Link to="/provider/services/add">Create your first service</Link></p>
      ) : (
        <div className="services-table-container">
          <table className="services-table">
            <thead>
              <tr><th>Name</th><th>Category</th><th>Price</th><th>Duration</th><th>Location</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id}>
                  <td data-label="Name">{service.name}</td>
                  <td data-label="Category">{service.category}</td>
                  <td data-label="Price">₹{service.price}</td>
                  <td data-label="Duration">{service.duration}</td>
                  <td data-label="Location">{service.location}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td data-label="Actions" className="actions">
                    <Link to={`/provider/services/edit/${service._id}`} className="edit-btn">Edit</Link>
                    <button onClick={() => toggleActive(service)} className="toggle-btn">
                      {service.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(service._id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageServices;