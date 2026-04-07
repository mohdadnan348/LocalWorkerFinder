import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserBookings } from '../../services/bookingService';
import { addReview } from '../../services/reviewService';
import './GiveReview.css';

const GiveReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await getUserBookings();
      const found = res.data.find(b => b._id === bookingId);
      if (!found) throw new Error('Booking not found');
      if (found.status !== 'completed') throw new Error('Only completed bookings can be reviewed');
      setBooking(found);
    } catch (err) {
      setError(err.message || 'Unable to load booking');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addReview({
        bookingId,
        rating,
        comment,
      });
      navigate('/customer/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Review submission failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="give-review-container">Loading...</div>;
  if (error) return <div className="give-review-container error">{error}</div>;

  return (
    <div className="give-review-container">
      <div className="review-card">
        <h1>Write a Review</h1>
        {booking && (
          <div className="booking-info">
            <p><strong>Service:</strong> {booking.serviceId?.name}</p>
            <p><strong>Provider:</strong> {booking.providerId?.userId?.name || 'Provider'}</p>
            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating (1-5 stars)</label>
            <div className="rating-stars">
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  className={`star ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Your Comment</label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this service..."
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={submitting} className="submit-review-btn">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GiveReview;