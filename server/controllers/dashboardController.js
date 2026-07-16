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

module.exports = {
  getStudentDashboard,
};