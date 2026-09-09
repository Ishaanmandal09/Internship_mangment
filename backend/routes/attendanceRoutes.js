// attendanceRoutes.js

const express = require('express');

const router = express.Router();

const { markAttendance, getAttendanceByInternship } =
  require('../controllers/attendanceController');

const { authMiddleware, authorize } =
  require('../middleware/authMiddleware');

router.route('/')
  .post(authMiddleware, authorize('teacher', 'admin'), markAttendance);

router.route('/:internshipId')
  .get(authMiddleware, getAttendanceByInternship);

module.exports = router;