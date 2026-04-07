const express = require('express');
const router = express.Router();
const { 
  addReview, 
  getProviderReviews, 
  getServiceReviews    // ✅ import new function
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.get('/provider/:providerId', getProviderReviews);
router.get('/service/:serviceId', getServiceReviews);   // ✅ NEW ROUTE

// Private: add review (customer only)
router.post('/', protect, authorize(['customer']), addReview);

module.exports = router;