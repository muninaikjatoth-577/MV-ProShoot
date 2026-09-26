const express = require('express');
const router = express.Router();
const {
  getSlots,
  holdSlot,
  releaseSlot,
  bookSlot,
  getMyBookings,
  createSlot,
  updateSlotStatus,
  getAllBookings,
} = require('../controllers/slot.controller');
const { protect, authorize } = require('../middleware/auth');

// Public or auth-optional slot viewing
router.get('/', getSlots);

// Authenticated booking flow
router.post('/:id/hold', protect, holdSlot);
router.post('/:id/release', protect, releaseSlot);
router.post('/:id/book', protect, bookSlot);
router.get('/my-bookings', protect, getMyBookings);

// Admin-only management
router.post('/', protect, authorize('admin'), createSlot);
router.patch('/:id/status', protect, authorize('admin'), updateSlotStatus);
router.get('/admin/all-bookings', protect, authorize('admin'), getAllBookings);

module.exports = router;
