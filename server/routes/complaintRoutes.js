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
  updateComplaintStatus,
  addStaffNotes,
  assignComplaint,
  updateComplaintPriority,
} = require('../controllers/complaintController');

const router = express.Router();

router.route('/')
  .post(protect, authorize('student'), upload, asyncHandler(createComplaint))
  .get(protect, authorize('admin'), asyncHandler(getAllComplaints));

router.get('/my', protect, authorize('student'), asyncHandler(getMyComplaints));
router.get('/assigned', protect, authorize('staff'), asyncHandler(getAssignedComplaints));
router.get('/:id', protect, asyncHandler(getComplaintById));
router.put('/:id', protect, asyncHandler(updateComplaint));
router.put('/:id/assign', protect, authorize('admin'), asyncHandler(assignComplaint));
router.put('/:id/priority', protect, authorize('admin'), asyncHandler(updateComplaintPriority));
router.put('/:id/status', protect, authorize('staff'), upload, asyncHandler(updateComplaintStatus));
router.put('/:id/notes', protect, authorize('staff'), asyncHandler(addStaffNotes));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteComplaint));

module.exports = router;