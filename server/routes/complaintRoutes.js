const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getAssignedComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');

const router = express.Router();

router.route('/')
  .post(protect, authorize('student'), upload, asyncHandler(createComplaint))
  .get(protect, authorize('admin'), asyncHandler(getAllComplaints));

router.get('/my', protect, authorize('student'), asyncHandler(getMyComplaints));
router.get('/assigned', protect, authorize('staff'), asyncHandler(getAssignedComplaints));
router.get('/:id', protect, asyncHandler(getComplaintById));
router.put('/:id', protect, asyncHandler(updateComplaint));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteComplaint));

module.exports = router;
