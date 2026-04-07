const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (admin)

// @desc    Create a new admin (only super-admin)
// @route   POST /api/admin/create
// @access  Private (super-admin)
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate required fields
    if (!phone || !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone and address are required' 
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: 'admin',
      isBlocked: false,
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalCustomers,
        totalBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Block/unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private (admin)
const blockUser = async (req, res) => {
  try {
    const { isBlocked } = req.body; // true or false
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isBlocked = isBlocked;
    await user.save();
    res.json({ success: true, message: `User ${isBlocked ? 'blocked' : 'unblocked'}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all providers (with details)
// @route   GET /api/admin/providers
// @access  Private (admin)
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find().populate('userId', 'name email phone isBlocked').sort({ createdAt: -1 });
    res.json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or block provider (by setting isBlocked on user)
// @route   PUT /api/admin/providers/:id/approve
// @access  Private (admin)
const approveProvider = async (req, res) => {
  try {
    const { isBlocked } = req.body; // false = approved, true = blocked
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    const user = await User.findById(provider.userId);
    user.isBlocked = isBlocked;
    await user.save();
    res.json({ success: true, message: `Provider ${isBlocked ? 'blocked' : 'approved'}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Private (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('serviceId', 'name price')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update any booking status (admin)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private (admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    booking.status = status;
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all services (admin)
// @route   GET /api/admin/services
// @access  Private (admin)
const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('providerId', 'userId')
      .populate({
        path: 'providerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete any service (admin)
// @route   DELETE /api/admin/services/:id
// @access  Private (admin)
const deleteServiceAdmin = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAdmin,
  getStats,
  getAllUsers,
  blockUser,
  getAllProviders,
  approveProvider,
  getAllBookings,
  updateBookingStatus,
  getAllServicesAdmin,
  deleteServiceAdmin,
};