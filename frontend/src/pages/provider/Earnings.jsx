import React, { useState, useEffect } from 'react';
import { getProviderBookings } from '../../services/bookingService';
import './Earnings.css';

const Earnings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    averagePerJob: 0,
  });

  useEffect(() => {
    fetchCompletedBookings();
  }, []);

  const fetchCompletedBookings = async () => {
    try {
      const res = await getProviderBookings();
      const completed = res.data.filter(b => b.status === 'completed');
      setBookings(completed);
      const total = completed.reduce((sum, b) => sum + b.totalAmount, 0);
      setStats({
        totalEarnings: total,
        completedJobs: completed.length,
        averagePerJob: completed.length ? total / completed.length : 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="earnings-container loading-state">Loading earnings...</div>;

  return (
    <div className="earnings-container">
      <h1>Earnings Report</h1>
      <div className="stats-summary">
        <div className="stat-box">
          <div className="stat-accent"></div>
          <h3>Total Earnings</h3>
          <div className="amount">₹{stats.totalEarnings}</div>
        </div>
        <div className="stat-box">
          <div className="stat-accent"></div>
          <h3>Completed Jobs</h3>
          <div className="number">{stats.completedJobs}</div>
        </div>
        <div className="stat-box">
          <div className="stat-accent"></div>
          <h3>Average per Job</h3>
          <div className="amount">₹{stats.averagePerJob.toFixed(2)}</div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No completed jobs yet.</p>
        </div>
      ) : (
        <div className="earnings-table-container">
          <table className="earnings-table">
            <thead>
              <tr><th>Date</th><th>Service</th><th>Customer</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.serviceId?.name}</td>
                  <td>{booking.userId?.name || 'Customer'}</td>
                  <td>₹{booking.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Earnings;