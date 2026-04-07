const express = require('express');
const router = express.Router();
const {
  createAdmin,
  getAllServicesAdmin,
  deleteServiceAdmin,
  getStats,
  getAllUsers,
  blockUser,
  getAllProviders,
  approveProvider,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public route – no authentication required
router.post('/create-admin', createAdmin);

// Protected admin routes
router.get('/services', protect, authorize(['admin']), getAllServicesAdmin);
router.delete('/services/:id', protect, authorize(['admin']), deleteServiceAdmin);
router.get('/dashboard/stats', protect, authorize(['admin']), getStats);
router.get('/users', protect, authorize(['admin']), getAllUsers);
router.put('/users/:id/block', protect, authorize(['admin']), blockUser);
router.get('/providers', protect, authorize(['admin']), getAllProviders);
router.put('/providers/:id/approve', protect, authorize(['admin']), approveProvider);
router.get('/bookings', protect, authorize(['admin']), getAllBookings);
router.put('/bookings/:id/status', protect, authorize(['admin']), updateBookingStatus);

module.exports = router;