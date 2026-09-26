const Service = require('../models/Service');

// @desc   Get all active shoot services
// @route  GET /api/services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ price: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new service (admin)
// @route  POST /api/services
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
