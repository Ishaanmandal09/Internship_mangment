const ClassSchedule = require('../models/ClassSchedule');

exports.getSchedules = async (req, res) => {
  try {
    const filter = req.params.internshipId ? { internship: req.params.internshipId } : {};
    const schedules = await ClassSchedule.find(filter).populate('internship', 'title').populate('teacher', 'name email');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { internshipId, date, startTime, endTime, topic } = req.body;
    
    const teacherId = req.user?.id || req.user?._id || req.user?.userId;

    const schedule = await ClassSchedule.create({
      internship: internshipId,
      teacher: teacherId,
      date,
      startTime,
      endTime,
      topic
    });
    
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const Model = req.baseUrl.includes('materials') ? require('../models/StudyMaterial') : require('../models/ClassSchedule');
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await ClassSchedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};