const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  try {
    const { student, internship, date, status } = req.body;

    const attendance = await Attendance.findOneAndUpdate(
      { student, internship: req.body.internship, date: new Date(date) },
      { status, markedBy: req.user.id },
      { new: true, upsert: true }
    );

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendanceByInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const records = await Attendance.find({ internship: internshipId })
      .populate('student', 'name email')
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};