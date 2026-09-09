const StudyMaterial = require('../models/StudyMaterial');
const Enrollment = require('../models/Enrollment');

exports.uploadMaterial = async (req, res) => {
  try {
    const { title, description, fileUrl, internshipId } = req.body;
    const material = await StudyMaterial.create({
      title,
      description,
      fileUrl,
      internshipId,
      uploadedBy: req.user.id
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'student') {
      const approvedEnrollments = await Enrollment.find({
        user: req.user.id || req.user._id,
        status: 'approved'
      });
      const approvedInternshipIds = approvedEnrollments.map(e => e.internshipId);
      filter = { internshipId: { $in: approvedInternshipIds } };
    }

    const materials = await StudyMaterial.find(filter)
      .populate('internshipId', 'title')
      .populate('uploadedBy', 'name');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMaterialsByInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;

    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        user: req.user.id || req.user._id,
        internshipId,
        status: 'approved'
      });
      if (!enrollment) {
        return res.status(403).json({ error: 'Access denied: You are not approved for this internship' });
      }
    }

    const materials = await StudyMaterial.find({ internshipId })
      .populate('uploadedBy', 'name');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

exports.deleteMaterial = async (req, res) => {
  try {
    const deleted = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Study material not found' });
    }
    res.json({ message: 'Study material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};