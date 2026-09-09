const Intensive = require('../models/Intensive');

exports.createInternship = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const internship = await Internship.create({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user.id
    });
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInternships = async (req, res) => {
  try {
    const internships = await Internship.find().populate('createdBy', 'name email');
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('createdBy', 'name email');
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};