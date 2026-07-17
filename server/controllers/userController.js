const { validationResult } = require('express-validator');
const User = require('../models/User');

const createStaff = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, email, password, department, employeeId, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: 'staff',
      department,
      employeeId,
      phone,
    });

    res.status(201).json({
      success: true,
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        employeeId: staff.employeeId,
        phone: staff.phone,
        isActive: staff.isActive,
      },
      message: 'Staff account created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { role, department } = req.query;
    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      data: users,
      message: 'Users fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'department', 'phone', 'isActive', 'employeeId', 'rollNumber', 'year'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      data: null,
      message: 'User disabled successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStaff,
  getUsers,
  updateUser,
  deleteUser,
};