const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }, // e.g., 'A', 'B', etc.
  marks: { type: Number, default: 1 }
});

module.exports = mongoose.model('Question', questionSchema);