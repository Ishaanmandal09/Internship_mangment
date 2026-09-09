const Enrollment = require('../models/Enrollment');

exports.enrollStudent = async (req, res) => {
  try {
    const { internshipId } = req.body;
    const studentId = req.user.id;

    const existingEnrollment = await Enrollment.findOne({ user: studentId, internshipId: internshipId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this internship' });
    }

    const enrollment = await Enrollment.create({
      user: studentId,
      internshipId: internshipId
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const filter = req.user.role === 'student' ? { user: req.user.id } : {};
    const enrollments = await Enrollment.find(filter)
      .populate('user', 'name email')
      .populate('internshipId', 'title startDate endDate');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};