const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Helper to auto-expire temporary holds
const autoExpireHolds = async () => {
  const now = new Date();
  await Slot.updateMany(
    {
      status: 'holding',
      'heldBy.expiresAt': { $lt: now },
    },
    {
      $set: {
        status: 'available',
        heldBy: null,
      },
    }
  );
};

// @desc   Get slots by date (default: today)
// @route  GET /api/slots?date=YYYY-MM-DD
exports.getSlots = async (req, res) => {
  try {
    await autoExpireHolds();

    const date = req.query.date || new Date().toISOString().split('T')[0];
    const slots = await Slot.find({ date })
      .populate('booking')
      .populate('allowedServices')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      date,
      data: slots,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Hold a slot temporarily (3 minutes lock)
// @route  POST /api/slots/:id/hold
exports.holdSlot = async (req, res) => {
  try {
    await autoExpireHolds();

    const slotId = req.params.id;
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.status === 'booked' || slot.status === 'blocked') {
      return res.status(400).json({
        success: false,
        message: `Slot is already ${slot.status}`,
      });
    }

    if (
      slot.status === 'holding' &&
      slot.heldBy?.userId &&
      slot.heldBy.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: 'This slot is currently being held by another client',
      });
    }

    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes lock

    slot.status = 'holding';
    slot.heldBy = {
      userId: req.user._id,
      userName: req.user.name,
      expiresAt,
    };
    await slot.save();

    // Broadcast real-time event via socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('slot:updated', {
        slotId: slot._id,
        status: 'holding',
        date: slot.date,
        heldBy: { userName: req.user.name },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Slot held for 3 minutes',
      data: slot,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Release held slot
// @route  POST /api/slots/:id/release
exports.releaseSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.status === 'holding') {
      slot.status = 'available';
      slot.heldBy = null;
      await slot.save();

      const io = req.app.get('io');
      if (io) {
        io.emit('slot:updated', {
          slotId: slot._id,
          status: 'available',
          date: slot.date,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Slot released back to available pool',
      data: slot,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Confirm & Book a slot
// @route  POST /api/slots/:id/book
exports.bookSlot = async (req, res) => {
  try {
    const slotId = req.params.id;
    const { serviceId, clientDetails, shootTheme, specialRequests } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.status === 'booked' || slot.status === 'blocked') {
      return res.status(400).json({
        success: false,
        message: 'This slot is unavailable for booking',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const bookingRef = `MVP-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const totalAmount = Math.round(service.price * (slot.priceMultiplier || 1.0));

    const booking = await Booking.create({
      bookingReference: bookingRef,
      user: req.user._id,
      slot: slot._id,
      service: service._id,
      clientDetails: {
        fullName: clientDetails?.fullName || req.user.name,
        email: clientDetails?.email || req.user.email,
        phone: clientDetails?.phone || req.user.phone || 'N/A',
        specialRequests: specialRequests || '',
        shootTheme: shootTheme || 'Cinematic MV Style',
      },
      totalAmount,
      paymentStatus: 'paid',
      status: 'confirmed',
    });

    // Populate full booking info for real-time Admin notification
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('slot')
      .populate('service');

    // Real-time broadcast to all viewers & admin dashboard
    const io = req.app.get('io');
    if (io) {
      // Broadcast slot status update to public calendar
      io.emit('slot:updated', {
        slotId: slot._id,
        status: 'booked',
        date: slot.date,
        bookedBy: req.user.name,
      });

      // Broadcast new booking notification to Admin Bay with full client details
      io.emit('booking:new', populatedBooking);
    }

    res.status(201).json({
      success: true,
      message: 'Photo shoot slot booked successfully! 🎉',
      data: {
        booking: populatedBooking,
        slot,
        service,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get user's personal booking history
// @route  GET /api/slots/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('slot')
      .populate('service')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Admin: Create single or multiple slots
// @route  POST /api/slots
exports.createSlot = async (req, res) => {
  try {
    const newSlot = await Slot.create(req.body);
    const io = req.app.get('io');
    if (io) {
      io.emit('slot:created', newSlot);
    }

    res.status(201).json({
      success: true,
      data: newSlot,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Admin: Toggle slot status or block slot
// @route  PATCH /api/slots/:id/status
exports.updateSlotStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('slot:updated', {
        slotId: slot._id,
        status: slot.status,
        date: slot.date,
      });
    }

    res.status(200).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Admin: Get all studio bookings
// @route  GET /api/slots/all-bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('slot')
      .populate('service')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
