import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../../services/serviceService';
import { createBooking } from '../../services/bookingService';
import './CreateBooking.css';

const CreateBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const res = await getServiceById(serviceId);
      setService(res.data);
    } catch (err) {
      setError('Service not found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.time || !bookingData.address) {
      setError('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await createBooking({
        serviceId,
        date: bookingData.date,
        time: bookingData.time,
        address: bookingData.address,
      });
      navigate('/customer/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="create-booking-container loading-state">Loading service details...</div>;
  if (error && !service) return <div className="create-booking-container error-state">{error}</div>;

  return (
    <div className="create-booking-container">
      <div className="booking-form-card">
        <h1>Book Service</h1>
        {service && (
          <div className="service-summary">
            <h2>{service.name}</h2>
            <p className="category">{service.category}</p>
            <p className="description">{service.description}</p>
            <div className="price-duration">
              <span>💰 ₹{service.price}</span>
              <span>⏱️ {service.duration}</span>
              <span>📍 {service.location}</span>
            </div>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Date</label>
            <input type="date" name="date" value={bookingData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="form-group">
            <label>Select Time</label>
            <input type="time" name="time" value={bookingData.time} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Your Address</label>
            <textarea name="address" rows="3" value={bookingData.address} onChange={handleChange} required placeholder="Enter complete address" />
          </div>
          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;