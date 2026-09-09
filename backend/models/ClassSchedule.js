const mongoose = require('mongoose');

const classScheduleSchema = new mongoose.Schema({
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('ClassSchedule', classScheduleSchema);