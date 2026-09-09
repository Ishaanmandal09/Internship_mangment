const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const newInternship = new Internship({ ...req.body, createdBy: req.user.id });
    await newInternship.save();
    res.status(201).json(newInternship);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create internship' });
  }
});

module.exports = router;