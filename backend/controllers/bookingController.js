const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const User = require('../models/User');

// @desc    Create a booking (customer)
// @route   POST /api/bookings
// @access  Private (customer)
const createBooking = async (req, res) => {
  try {
    const { serviceId, date, time, address } = req.body;
    const userId = req.user.id;

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ success: false, message: 'Service not available' });
    }

    const provider = await Provider.findById(service.providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    const booking = await Booking.create({
      userId,
      providerId: provider._id,
      serviceId,
      date,
      time,
      address,
      totalAmount: service.price,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's bookings (role-based)
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    let query = {};
    const user = await User.findById(req.user.id);

    if (user.role === 'customer') {
      query.userId = req.user.id;
    } else if (user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider) return res.status(404).json({ success: false, message: 'Provider profile missing' });
      query.providerId = provider._id;
    } else if (user.role === 'admin') {
      // admin can see all, no filter
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('providerId', 'userId location')
      .populate('serviceId', 'name price duration')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (provider/admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (provider/admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const user = await User.findById(req.user.id);
    if (user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider || booking.providerId.toString() !== provider._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
    } else if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    booking.status = status;
    await booking.save();

    // If completed, update provider earnings (optional)
    if (status === 'completed') {
      const provider = await Provider.findById(booking.providerId);
      provider.totalEarnings += booking.totalAmount;
      await provider.save();
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking (customer if pending)
// @route   DELETE /api/bookings/:id
// @access  Private (customer)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not your booking' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot cancel non-pending booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
};