const Test = require('../models/Test');
const TestResult = require('../models/TestResult');

exports.createTest = async (req, res) => {
  try {
    const { title, internshipId, duration, startDate, endDate, questions } = req.body;
    const test = await Test.create({
      title, 
      internshipId, 
      duration, 
      startDate, 
      endDate, 
      questions, 
      createdBy: req.user.id || req.user._id
    });
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find({}).populate('internshipId', 'title');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTestResults = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    let query = {};

    if (req.user.role === 'student') {
      query.student = userId;
    } else if (req.user.role === 'teacher') {
      // Find internships where this teacher is allocated
      const internships = await Internship.find({ teacher: userId }).select('_id');
      const internshipIds = internships.map(i => i._id);
      // Find tests belonging to these internships
      const tests = await Test.find({ internshipId: { $in: internshipIds } }).select('_id');
      const testIds = tests.map(t => t._id);
      query.test = { $in: testIds };
    }

    const results = await TestResult.find(query)
      .populate('test', 'title description internshipId')
      .populate('student', 'name email');
      
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    let score = 0;
    // Handle both array of objects, array of indices, or object maps safely
    const studentAnswers = answers || [];

    test.questions.forEach((q, index) => {
      let userAns = null;
      if (Array.isArray(studentAnswers)) {
        userAns = studentAnswers.find(a => 
          a?.questionIndex === index || 
          a?.questionId === q._id?.toString()
        ) ?? studentAnswers[index];
      } else if (typeof studentAnswers === 'object') {
        userAns = studentAnswers[index] || studentAnswers[q._id];
      }

      const selectedOption = userAns?.selectedOption !== undefined ? userAns.selectedOption : userAns;

      if (selectedOption !== undefined && Number(selectedOption) === Number(q.correctAnswer)) {
        score += 1;
      }
    });

    const result = await TestResult.create({
      student: req.user.id || req.user._id,
      test: testId,
      score,
      totalMarks: test.questions.length
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Submit test server error:", error);
    res.status(500).json({ error: error.message });
  }
};