import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUserBookings } from '../../services/bookingService';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getUserBookings();
      const bookings = res.data;
      setRecentBookings(bookings.slice(0, 5));
      setStats({
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
      });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your service bookings and explore new services</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <div className="stat-number">{stats.pending}</div>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <div className="stat-number">{stats.completed}</div>
        </div>
        <div className="stat-card cancelled">
          <h3>Cancelled</h3>
          <div className="stat-number">{stats.cancelled}</div>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/customer/browse" className="action-btn primary">Browse Services</Link>
        <Link to="/customer/history" className="action-btn secondary">View All Bookings</Link>
      </div>

      <div className="recent-bookings">
        <h2>Recent Bookings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentBookings.length === 0 ? (
          <p>No bookings yet. <Link to="/customer/browse">Book a service now!</Link></p>
        ) : (
          <div className="bookings-list">
            {recentBookings.map(booking => (
              <div key={booking._id} className="booking-item">
                <div className="booking-info">
                  <span className="service-name">{booking.serviceId?.name}</span>
                  <span className="booking-date">{new Date(booking.date).toLocaleDateString()}</span>
                  <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                </div>
                <div className="booking-amount">₹{booking.totalAmount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;