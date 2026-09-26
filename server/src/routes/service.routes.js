const express = require('express');
const router = express.Router();
const { getServices, createService } = require('../controllers/service.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getServices);
router.post('/', protect, authorize('admin'), createService);

module.exports = router;
