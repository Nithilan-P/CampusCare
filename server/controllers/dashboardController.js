const Complaint = require('../models/Complaint');

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

module.exports = {
  getStudentDashboard,
  getStaffDashboard,
};