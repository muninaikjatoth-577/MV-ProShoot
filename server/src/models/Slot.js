const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Stored as YYYY-MM-DD for easy querying
      required: true,
      index: true,
    },
    startTime: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },
    endTime: {
      type: String, // e.g. "11:30 AM"
      required: true,
    },
    studioBay: {
      type: String,
      default: 'Studio Stage A - Neon & Holo Set',
    },
    allowedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    status: {
      type: String,
      enum: ['available', 'holding', 'booked', 'blocked'],
      default: 'available',
      index: true,
    },
    priceMultiplier: {
      type: Number,
      default: 1.0, // Peak hour or weekend multiplier
    },
    heldBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      userName: String,
      socketId: String,
      expiresAt: Date,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);
