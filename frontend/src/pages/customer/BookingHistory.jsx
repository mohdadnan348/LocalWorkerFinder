import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../../services/bookingService';
import { addReview } from '../../services/reviewService';
import './BookingHistory.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getUserBookings();
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        fetchBookings();
      } catch (err) {
        alert(err.response?.data?.message || 'Cancellation failed');
      }
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReview({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      await addReview({
        bookingId: selectedBooking._id,
        rating: review.rating,
        comment: review.comment,
      });
      setShowReviewModal(false);
      alert('Review submitted!');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    }
  };

  return (
    <div className="history-container">
      <h1>My Bookings</h1>
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : bookings.length === 0 ? (
        <p className="empty-state">No bookings found. <a href="/customer/browse">Browse services</a></p>
      ) : (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Service</th><th>Date</th><th>Time</th><th>Address</th><th>Amount</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td data-label="Service">{booking.serviceId?.name}</td>
                  <td data-label="Date">{new Date(booking.date).toLocaleDateString()}</td>
                  <td data-label="Time">{booking.time}</td>
                  <td data-label="Address">{booking.address}</td>
                  <td data-label="Amount">₹{booking.totalAmount}</td>
                  <td data-label="Status"><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
                  <td data-label="Actions">
                    {booking.status === 'pending' && (
                      <button onClick={() => handleCancel(booking._id)} className="cancel-btn">Cancel</button>
                    )}
                    {booking.status === 'completed' && (
                      <button onClick={() => openReviewModal(booking)} className="review-btn">Write Review</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Review Service</h2>
            <div className="review-form">
              <label>Rating (1-5)</label>
              <select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} star{r>1?'s':''}</option>)}
              </select>
              <label>Comment</label>
              <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} rows="3" placeholder="Share your experience..." />
              <div className="modal-buttons">
                <button onClick={submitReview} className="confirm">Submit</button>
                <button onClick={() => setShowReviewModal(false)} className="cancel">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;