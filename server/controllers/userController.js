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

module.exports = {
  createStaff,
};