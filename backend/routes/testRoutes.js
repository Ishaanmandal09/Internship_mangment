const express = require('express');
const router = express.Router();
const { createTest, getTests, submitTest, getTestResults } = require('../controllers/testController');
const { authMiddleware } = require('../middleware/authMiddleware');
const Test = require('../models/Test'); 

router.get('/results', authMiddleware, getTestResults);

router.route('/')
  .get(authMiddleware, getTests)
  .post(authMiddleware, createTest);

router.route('/:testId/submit')
  .post(authMiddleware, submitTest);

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log("Attempting to delete Test with ID:", req.params.id);
    const deletedTest = await Test.findByIdAndDelete(req.params.id);
    console.log("Delete result:", deletedTest);

    if (!deletedTest) {
      return res.status(404).json({ error: 'Test not found in database' });
    }
    res.json({ message: 'Test deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: 'Server error while deleting test' });
  }
});

module.exports = router;