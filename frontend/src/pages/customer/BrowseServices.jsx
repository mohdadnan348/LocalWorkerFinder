import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServices } from '../../services/serviceService';
import { createBooking } from '../../services/bookingService';
import ServiceReviews from '../../components/ServiceReviews';
import './BrowseServices.css';

const BrowseServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', location: '' });
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '', address: '' });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [showReviewsFor, setShowReviewsFor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    try {
      const res = await getAllServices(filters);
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setLoading(true);
  };

  const openBookingModal = (service) => {
    setSelectedService(service);
    setBookingData({ date: '', time: '', address: '' });
    setShowModal(true);
    setError('');
  };

  const handleBookingInput = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const submitBooking = async () => {
    if (!bookingData.date || !bookingData.time || !bookingData.address) {
      setError('Please fill all fields');
      return;
    }
    try {
      await createBooking({
        serviceId: selectedService._id,
        date: bookingData.date,
        time: bookingData.time,
        address: bookingData.address,
      });
      setShowModal(false);
      navigate('/customer/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  const toggleReviews = (serviceId) => {
    setShowReviewsFor(showReviewsFor === serviceId ? null : serviceId);
  };

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Browse Services</h1>
        <p className="subtitle">Find the perfect professional for your needs</p>
      </div>
      <div className="filters">
        <input
          type="text"
          name="category"
          placeholder="Filter by category (e.g., Plumber)"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by location"
          value={filters.location}
          onChange={handleFilterChange}
        />
      </div>

      {loading ? (
        <div className="loader">Loading services...</div>
      ) : services.length === 0 ? (
        <p className="no-services">No services found. Try different filters.</p>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <div key={service._id} className="service-card">
              <h3>{service.name}</h3>
              <p className="category">{service.category}</p>
              <p className="description">{service.description}</p>
              <div className="service-details">
                <span className="price">💰 ₹{service.price}</span>
                <span className="duration">⏱️ {service.duration}</span>
                <span className="location">📍 {service.location}</span>
              </div>
              
              <button 
                onClick={() => toggleReviews(service._id)} 
                className="reviews-toggle-btn"
              >
                {showReviewsFor === service._id ? 'Hide Reviews' : 'Show Reviews'}
              </button>
              
              {showReviewsFor === service._id && (
                <ServiceReviews serviceId={service._id} />
              )}
              
              <button onClick={() => openBookingModal(service)} className="book-btn">
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Book Service: {selectedService?.name}</h2>
            {error && <div className="error">{error}</div>}
            <div className="modal-form">
              <input type="date" name="date" value={bookingData.date} onChange={handleBookingInput} required />
              <input type="time" name="time" value={bookingData.time} onChange={handleBookingInput} required />
              <textarea name="address" placeholder="Your address" value={bookingData.address} onChange={handleBookingInput} required />
              <div className="modal-buttons">
                <button onClick={submitBooking} className="confirm">Confirm Booking</button>
                <button onClick={() => setShowModal(false)} className="cancel">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseServices;