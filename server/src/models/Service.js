const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Wedding & Pre-Shoot', 'Fashion & Editorial', 'Cinematic MV Shoot', 'Product & Commercial', 'Studio Portrait'],
      default: 'Studio Portrait',
    },
    description: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    price: {
      type: Number,
      required: true,
    },
    badge: {
      type: String,
      default: 'Trending',
    },
    features: [
      {
        type: String,
      },
    ],
    coverImage: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
