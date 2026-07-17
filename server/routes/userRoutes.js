const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { createStaff, getUsers, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post(
  '/staff',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  asyncHandler(createStaff)
);

router.get('/', protect, authorize('admin'), asyncHandler(getUsers));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateUser));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteUser));

module.exports = router;