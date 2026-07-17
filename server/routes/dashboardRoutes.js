const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { getStudentDashboard, getStaffDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/student', protect, authorize('student'), asyncHandler(getStudentDashboard));
router.get('/staff', protect, authorize('staff'), asyncHandler(getStaffDashboard));

module.exports = router;