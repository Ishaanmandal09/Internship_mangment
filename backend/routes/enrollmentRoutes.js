const express = require('express');

const router = express.Router();

const { enrollStudent, getEnrollments } =
  require('../controllers/enrollmentController');

const { authMiddleware, authorize } =
  require('../middleware/authMiddleware');

router.route('/')
  .get(authMiddleware, getEnrollments)
  .post(authMiddleware, authorize('student'), enrollStudent);

router.get('/my-status', authMiddleware, authorize('student'), async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized user context' });
    }

    const enrollments = await Enrollment.find({ user: userId })
      .populate('internshipId', 'title description startDate endDate');
      
    res.json(enrollments);
  } catch (error) {
    console.error("Enrollment status fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;