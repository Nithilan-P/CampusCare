const Complaint = require('../models/Complaint');
const User = require('../models/User');

const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const [total, pending, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments({ studentId }),
      Complaint.countDocuments({ studentId, status: 'Pending' }),
      Complaint.countDocuments({ studentId, status: { $in: ['Assigned', 'In Progress'] } }),
      Complaint.countDocuments({ studentId, status: 'Resolved' }),
    ]);

    const recentComplaints = await Complaint.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: {
        stats: { total, pending, inProgress, resolved },
        recentComplaints,
      },
      message: 'Student dashboard stats fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getStaffDashboard = async (req, res, next) => {
  try {
    const staffId = req.user._id;

    const [assigned, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments({ assignedTo: staffId, status: 'Assigned' }),
      Complaint.countDocuments({ assignedTo: staffId, status: 'In Progress' }),
      Complaint.countDocuments({ assignedTo: staffId, status: 'Resolved' }),
    ]);

    const total = await Complaint.countDocuments({ assignedTo: staffId });

    const recentComplaints = await Complaint.find({ assignedTo: staffId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('studentId', 'name email');

    res.status(200).json({
      success: true,
      data: {
        stats: { total, assigned, inProgress, resolved },
        recentComplaints,
      },
      message: 'Staff dashboard stats fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalComplaints, pending, assigned, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Assigned' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
    ]);

    const [totalStudents, totalStaff] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'staff' }),
    ]);

    const categoryBreakdown = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const priorityBreakdown = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalComplaints,
          pending,
          assigned,
          inProgress,
          resolved,
          totalStudents,
          totalStaff,
        },
        categoryBreakdown,
        priorityBreakdown,
        recentComplaints,
      },
      message: 'Admin dashboard stats fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
  getStaffDashboard,
  getAdminDashboard,
};