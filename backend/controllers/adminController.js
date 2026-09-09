const User = require('../models/User');
const Internship = require('../models/Internship');
const Enrollment = require('../models/Enrollment');

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    const students = await User.find({ role: 'student' }).select('-password');
    const internships = await Internship.find({});
    
    const rawEnrollments = await Enrollment.find({})
      .populate('user', 'name email')
      .populate('internshipId', 'title');

    const enrollments = rawEnrollments.map(en => ({
      _id: en._id,
      status: en.status,
      student: en.user,
      internship: en.internshipId,
      createdAt: en.createdAt
    }));

    res.json({ totalTeachers, totalStudents, teachers, students, internships, enrollments });
  } catch (error) {
    console.error("Dashboard stats crash:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId, status } = req.body; 
    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId, 
      { status }, 
      { returnDocument: 'after' }
    );
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment record not found' });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.allocateTeacher = async (req, res) => {
  try {
    const { teacherId, internshipId } = req.body;
    if (!teacherId || !internshipId) {
      return res.status(400).json({ error: 'Teacher and internshipId are required' });
    }

    const internship = await Internship.findByIdAndUpdate(
      internshipId,
      { teacher: teacherId },
      { new: true, runValidators: true }
    );

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    res.json(internship);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};