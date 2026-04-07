import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalCustomers: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-dashboard">Loading dashboard...</div>;
  if (error) return <div className="admin-dashboard error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-nav-buttons">
        <button onClick={() => navigate('/admin/users')} className="nav-btn users-btn">
          👥 Manage Users
        </button>
        <button onClick={() => navigate('/admin/providers')} className="nav-btn providers-btn">
          🛠️ Manage Providers
        </button>
        <button onClick={() => navigate('/admin/bookings')} className="nav-btn bookings-btn">
          📅 All Bookings
        </button>
        <button onClick={() => navigate('/admin/services')} className="nav-btn services-btn">
          🔧 All Services
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Providers</h3>
          <div className="stat-number">{stats.totalProviders}</div>
        </div>
        <div className="stat-card">
          <h3>Customers</h3>
          <div className="stat-number">{stats.totalCustomers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <div className="stat-number">{stats.totalBookings}</div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-number">{stats.completedBookings}</div>
        </div>
        <div className="stat-card revenue">
          <h3>Revenue</h3>
          <div className="stat-number">₹{stats.totalRevenue}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;