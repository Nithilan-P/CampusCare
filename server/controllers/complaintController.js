const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const Complaint = require('../models/Complaint');
const { asyncHandler } = require('../middleware/errorHandler');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, priority } = req.body;

    let imageUrl = null;
    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'campuscare',
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      priority: priority || 'Medium',
      studentId: req.user._id,
      image: imageUrl,
      timeline: [
        {
          status: 'Pending',
          note: 'Complaint submitted',
          date: new Date(),
        },
      ],
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('studentId', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      data: populatedComplaint,
      message: 'Complaint created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const { search, filterStatus, filterCategory, sort = 'desc' } = req.query;
    const query = { studentId: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    if (filterCategory) {
      query.category = filterCategory;
    }

    const sortOrder = sort === 'asc' ? 1 : -1;

    const complaints = await Complaint.find(query)
      .sort({ createdAt: sortOrder })
      .populate('studentId', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: complaints,
      message: 'My complaints fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAllComplaints = async (req, res, next) => {
  try {
    const { category, status, priority, department } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate('studentId', 'name email department')
      .populate('assignedTo', 'name email');

    let filteredComplaints = complaints;
    if (department) {
      filteredComplaints = complaints.filter(
        (complaint) => complaint.studentId?.department === department
      );
    }

    res.status(200).json({
      success: true,
      data: filteredComplaints,
      message: 'All complaints fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAssignedComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user._id })
      .populate('studentId', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: complaints,
      message: 'Assigned complaints fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name email role department')
      .populate('assignedTo', 'name email role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const isOwner = complaint.studentId?._id?.toString() === req.user._id.toString();
    const isAssigned = complaint.assignedTo?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
      message: 'Complaint fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const isOwner = complaint.studentId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint',
      });
    }

    if (complaint.status !== 'Pending' && !isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Only pending complaints can be edited by students',
      });
    }

    const allowedFields = ['title', 'description', 'category', 'location'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('studentId', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: updatedComplaint,
      message: 'Complaint updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    await complaint.remove();

    res.status(200).json({
      success: true,
      data: null,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getAssignedComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
