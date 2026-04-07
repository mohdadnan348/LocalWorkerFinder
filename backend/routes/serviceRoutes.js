const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getAllServices);

// Provider only routes – specific routes MUST come before /:id
router.get('/my', protect, authorize(['provider']), getMyServices);
router.post('/', protect, authorize(['provider']), createService);

// Dynamic routes – keep these AFTER specific routes
router.get('/:id', getServiceById);
router.put('/:id', protect, authorize(['provider']), updateService);
router.delete('/:id', protect, authorize(['provider']), deleteService);

module.exports = router;