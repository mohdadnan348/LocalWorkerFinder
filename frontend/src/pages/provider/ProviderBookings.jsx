import React, { useState, useEffect } from 'react';
import { getProviderBookings, updateBookingStatus } from '../../services/bookingService';
import './ProviderBookings.css';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getProviderBookings();
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      fetchBookings();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getNextStatusOptions = (currentStatus) => {
    const map = {
      pending: ['accepted', 'cancelled'],
      accepted: ['ongoing', 'cancelled'],
      ongoing: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };
    return map[currentStatus] || [];
  };

  if (loading) return <div className="provider-bookings loading-state">Loading bookings...</div>;

  return (
    <div className="provider-bookings">
      <div className="container">
        <h1>My Bookings</h1>
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
          <button className={filter === 'accepted' ? 'active' : ''} onClick={() => setFilter('accepted')}>Accepted</button>
          <button className={filter === 'ongoing' ? 'active' : ''} onClick={() => setFilter('ongoing')}>Ongoing</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
          <button className={filter === 'cancelled' ? 'active' : ''} onClick={() => setFilter('cancelled')}>Cancelled</button>
        </div>

        {filteredBookings.length === 0 ? (
          <p className="empty-state">No bookings found.</p>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <span className="customer">{booking.userId?.name || 'Customer'}</span>
                  <span className={`status ${booking.status}`}>{booking.status}</span>
                </div>
                <div className="booking-details">
                  <p><strong>Service:</strong> {booking.serviceId?.name}</p>
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                  <p><strong>Address:</strong> {booking.address}</p>
                  <p><strong>Amount:</strong> ₹{booking.totalAmount}</p>
                </div>
                <div className="booking-actions">
                  {getNextStatusOptions(booking.status).map(status => (
                    <button key={status} onClick={() => handleStatusUpdate(booking._id, status)} className={`action-${status}`}>
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderBookings;