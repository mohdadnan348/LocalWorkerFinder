import React, { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatusAdmin } from '../../services/adminService';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatusAdmin(bookingId, newStatus);
      fetchBookings();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const statusOptions = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'];

  if (loading) return <div className="admin-bookings">Loading...</div>;
  if (error) return <div className="admin-bookings error">{error}</div>;

  return (
    <div className="admin-bookings">
      <h1>All Bookings</h1>
      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        {statusOptions.map(s => (
          <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.userId?.name || 'N/A'}</td>
                  <td>{booking.providerId?.userId?.name || 'Provider'}</td>
                  <td>{booking.serviceId?.name}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.time}</td>
                  <td>₹{booking.totalAmount}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                  </td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                      className="status-select"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
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

export default AdminBookings;