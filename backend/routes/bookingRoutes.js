const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All booking routes are protected
router.use(protect);

// Customer creates booking
router.post('/', authorize(['customer']), createBooking);

// Get user's own bookings (customer/provider/admin see different sets)
router.get('/', getUserBookings);

// Update status (provider or admin)
router.put('/:id/status', authorize(['provider', 'admin']), updateBookingStatus);

// Cancel booking (customer only, if pending)
router.delete('/:id', authorize(['customer']), cancelBooking);

module.exports = router;