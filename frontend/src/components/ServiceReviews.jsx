// components/ServiceReviews.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceReviews.css';

const ServiceReviews = ({ serviceId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) {
      fetchReviews();
    }
  }, [serviceId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/service/${serviceId}`);
      setReviews(res.data.data);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="reviews-loading">Loading reviews...</div>;

  return (
    <div className="service-reviews">
      <div className="reviews-summary">
        <h3>Customer Reviews</h3>
        <div className="rating-summary">
          <span className="average-rating">{averageRating.toFixed(1)}</span>
          <span className="stars">
            {'⭐'.repeat(Math.round(averageRating))}
          </span>
          <span className="total-reviews">({totalReviews} reviews)</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <strong>{review.customer?.name}</strong>
                <span className="review-rating">
                  {'⭐'.repeat(review.rating)}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceReviews;