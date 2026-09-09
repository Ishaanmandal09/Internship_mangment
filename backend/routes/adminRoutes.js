const express = require('express');
const router = express.Router();
const { 
  getAdminDashboardStats, 
  updateEnrollmentStatus, 
  deleteUser, 
  allocateTeacher, 
  deleteInternship 
} = require('../controllers/admincontroller');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

router.route('/stats').get(authMiddleware, authorize('admin', 'teacher'), getAdminDashboardStats);
router.route('/enrollment').put(authMiddleware, authorize('admin', 'teacher'), updateEnrollmentStatus);
router.route('/user/:userId').delete(authMiddleware, authorize('admin'), deleteUser);
router.route('/allocate-teacher').post(authMiddleware, authorize('admin'), allocateTeacher);
router.route('/internship/:id').delete(authMiddleware, authorize('admin'), deleteInternship);

module.exports = router;