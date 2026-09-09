const express = require('express');
const router = express.Router();
const { 
  getSchedules, 
  createSchedule, 
  deleteSchedule 
} = require('../controllers/scheduleController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(authMiddleware, getSchedules)
  .post(authMiddleware, authorize('admin', 'teacher'), createSchedule);

router.route('/:id')
  .delete(authMiddleware, authorize('admin', 'teacher'), deleteSchedule);

module.exports = router;