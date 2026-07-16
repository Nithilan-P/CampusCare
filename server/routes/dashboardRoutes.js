const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { getStudentDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/student', protect, authorize('student'), asyncHandler(getStudentDashboard));

module.exports = router;