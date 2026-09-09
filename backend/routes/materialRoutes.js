const express = require('express');
const router = express.Router();
const { 
  uploadMaterial, 
  getAllMaterials, 
  getMaterialsByInternship, 
  deleteMaterial 
} = require('../controllers/studyMaterialController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(authMiddleware, getAllMaterials)
  .post(authMiddleware, authorize('admin', 'teacher'), uploadMaterial);

router.route('/internship/:internshipId')
  .get(authMiddleware, getMaterialsByInternship);

router.route('/:id')
  .delete(authMiddleware, authorize('admin', 'teacher'), deleteMaterial);

module.exports = router;