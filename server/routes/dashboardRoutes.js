const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { getStudentDashboard, getStaffDashboard, getAdminDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/student', protect, authorize('student'), asyncHandler(getStudentDashboard));
router.get('/staff', protect, authorize('staff'), asyncHandler(getStaffDashboard));
router.get('/admin', protect, authorize('admin'), asyncHandler(getAdminDashboard));

module.exports = router;