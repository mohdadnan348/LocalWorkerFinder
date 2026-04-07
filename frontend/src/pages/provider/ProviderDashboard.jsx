import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getProviderBookings } from '../../services/bookingService';
import { getProviderServices } from '../../services/serviceService';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    earnings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [servicesRes, bookingsRes] = await Promise.all([
        getProviderServices(),
        getProviderBookings(),
      ]);
      const services = servicesRes.data || [];
      const bookings = bookingsRes.data || [];
      const completedBookings = bookings.filter(b => b.status === 'completed');
      const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      setStats({
        totalServices: services.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: completedBookings.length,
        earnings: totalEarnings,
      });
      setRecentBookings(bookings.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your services and track bookings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>My Services</h3>
          <div className="stat-number">{stats.totalServices}</div>
          <Link to="/provider/services" className="stat-link">Manage</Link>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <div className="stat-number">{stats.totalBookings}</div>
        </div>
        <div className="stat-card pending">
          <h3>Pending Requests</h3>
          <div className="stat-number">{stats.pendingBookings}</div>
          <Link to="/provider/bookings" className="stat-link">View</Link>
        </div>
        <div className="stat-card completed">
          <h3>Completed Jobs</h3>
          <div className="stat-number">{stats.completedBookings}</div>
        </div>
        <div className="stat-card earnings">
          <h3>Total Earnings</h3>
          <div className="stat-number">₹{stats.earnings}</div>
          <Link to="/provider/earnings" className="stat-link">Details</Link>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/provider/services/add" className="action-btn primary">+ Add New Service</Link>
        <Link to="/provider/bookings" className="action-btn secondary">View All Bookings</Link>
      </div>

      <div className="recent-bookings">
        <h2>Recent Bookings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentBookings.length === 0 ? (
          <p>No bookings yet. Share your services to get orders.</p>
        ) : (
          <div className="bookings-list">
            {recentBookings.map(booking => (
              <div key={booking._id} className="booking-item">
                <div className="booking-info">
                  <span className="customer-name">{booking.userId?.name || 'Customer'}</span>
                  <span className="service-name">{booking.serviceId?.name}</span>
                  <span className="booking-date">{new Date(booking.date).toLocaleDateString()}</span>
                  <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                </div>
                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button className="accept-btn">Accept</button>
                      <button className="reject-btn">Reject</button>
                    </>
                  )}
                  {booking.status === 'accepted' && <button className="ongoing-btn">Mark Ongoing</button>}
                  {booking.status === 'ongoing' && <button className="complete-btn">Mark Completed</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;