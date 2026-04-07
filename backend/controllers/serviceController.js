const Service = require('../models/Service');
const Provider = require('../models/Provider');

// @desc    Create a service (provider only)
// @route   POST /api/services
// @access  Private (provider)
const createService = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(403).json({ success: false, message: 'Provider profile not found' });
    }

    const { name, category, description, price, duration, location } = req.body;

    const service = await Service.create({
      providerId: provider._id,
      name,
      category,
      description,
      price,
      duration,
      location,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all services (with filters)
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const services = await Service.find(filter).populate('providerId', 'userId rating totalEarnings');
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('providerId');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service (provider owner only)
// @route   PUT /api/services/:id
// @access  Private (provider)
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider || service.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get services for logged-in provider
// @route   GET /api/services/my
// @access  Private (provider)
const getMyServices = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const services = await Service.find({ providerId: provider._id });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service (provider owner only)
// @route   DELETE /api/services/:id
// @access  Private (provider)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider || service.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices,
};