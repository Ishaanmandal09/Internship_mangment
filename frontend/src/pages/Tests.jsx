import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Award, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [submittedTestIds, setSubmittedTestIds] = useState([]);
  const [answers, setAnswers] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    internshipId: '',
    duration: '60',
    startDate: '',
    endDate: ''
  });
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 1 }
  ]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTests();
    fetchResults();
  }, []);

  const fetchTests = async () => {
    try {
      const { data } = await API.get('/tests');
      setTests(data);
    } catch (err) {
      setError('Failed to fetch tests');
    }
  };

  const fetchResults = async () => {
    try {
      const { data } = await API.get('/tests/results');
      setResults(data);
      const submittedIds = (data || []).map(r => typeof r.test === 'object' ? r.test?._id : r.test);
      setSubmittedTestIds(submittedIds.filter(Boolean));
    } catch (err) {}
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 1 }]);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = Number(value);
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAnswerSelect = (testId, qIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [testId]: {
        ...(answers[testId] || {}),
        [qIndex]: optionIndex + 1
      }
    });
  };

  const handleSubmitTest = async (testId) => {
    setError('');
    try {
      const testAnswers = answers[testId] || {};
      const formattedAnswers = Object.keys(testAnswers).map(index => ({
        questionIndex: Number(index),
        selectedOption: Number(testAnswers[index])
      }));

      const { data } = await API.post(`/tests/${testId}/submit`, { answers: formattedAnswers });
      
      setSubmittedTestIds(prev => [...prev, testId]);
      alert(`Test submitted successfully! You scored ${data.score} out of ${data.totalMarks}.`);
      fetchResults();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit test');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test assessment?')) return;
    try {
      await API.delete(`/tests/${testId}`);
      setTests(tests.filter(t => t._id !== testId));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to delete test');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        questions
      };
      await API.post('/tests', payload);
      setFormData({ title: '', internshipId: '', duration: '60', startDate: '', endDate: '' });
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 1 }]);
      fetchTests();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create test');
    }
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award color="#3b6e51" size={32} /> Tests & Evaluations
        </h1>
        <p style={{ color: '#5a7665', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
          Create assessments, manage MCQs, and track quiz performance.
        </p>
      </header>

      {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <form onSubmit={handleSubmit} className="ims-card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#234731' }}>
            Create New Test Assessment
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <input type="text" placeholder="Test Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="ims-input" />
            <input type="text" placeholder="Internship ID" value={formData.internshipId} onChange={(e) => setFormData({...formData, internshipId: e.target.value})} required className="ims-input" />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>Duration (minutes)</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required className="ims-input" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>Start Date</label>
              <input type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required className="ims-input" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>End Date</label>
              <input type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required className="ims-input" />
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #e2ece4', marginBottom: '1.5rem' }} />

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#234731', marginBottom: '1rem' }}>Questions & Options</h3>
          
          {questions.map((q, qIndex) => (
            <div key={qIndex} style={{ background: '#f4f8f5', padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #d4e4d7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: '#274d35', fontSize: '0.9rem' }}>Question {qIndex + 1}</span>
                {questions.length > 1 && (
                  <button type="button" onClick={() => handleRemoveQuestion(qIndex)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </div>
              
              <input type="text" placeholder="Enter question text..." value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} required className="ims-input" style={{ marginBottom: '1rem' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                {q.options.map((opt, oIndex) => (
                  <input key={oIndex} type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} required className="ims-input" />
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '300px' }}>
                <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>Correct Option (1, 2, 3, or 4)</label>
                <input type="number" min="1" max="4" value={q.correctAnswer} onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)} required className="ims-input" />
              </div>
            </div>
          ))}

          <button type="button" onClick={handleAddQuestion} style={{ background: '#e4efe7', color: '#274d35', border: '1px dashed #3b6e51', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Another Question
          </button>

          <div>
            <button type="submit" className="ims-btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
              Publish Test
            </button>
          </div>
        </form>
      )}

      {user?.role === 'student' && results.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b3826', marginBottom: '1rem' }}>My Completed Test Scores</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map(res => (
              <div key={res._id} className="ims-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>{res.test?.title || 'Assessment'}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={16} /> You scored **{res.score}** correct out of **{res.totalMarks}** questions.
                  </p>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Submitted on {new Date(res.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {tests.map((test) => {
          const userResult = results.find(r => (r.test?._id || r.test || r.testId) === test._id);
          const isSubmitted = submittedTestIds.includes(test._id) || userResult;

          if (user?.role === 'student' && isSubmitted) {
            return null; // Hide pending view once submitted
          }

          return (
            <div key={test._id} className="ims-card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1b3826', marginBottom: '0.35rem' }}>{test.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#5a7665', marginBottom: '0.5rem' }}>Duration: {test.duration} minutes | Questions: {test.questions?.length || 0}</p>
                  <p style={{ fontSize: '0.8rem', color: '#7a9a85', marginBottom: '1rem' }}>Internship ID: {test.internshipId?.title || test.internshipId}</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'teacher') && (
                  <button onClick={() => handleDeleteTest(test._id)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer' }} title="Delete Test">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {user?.role === 'student' ? (
                <div style={{ marginTop: '1rem', borderTop: '1px solid #e2ece4', paddingTop: '1rem' }}>
                  <div>
                    {test.questions?.map((q, qIdx) => (
                      <div key={qIdx} style={{ marginBottom: '1rem', background: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1b3826', marginBottom: '0.5rem' }}>Q{qIdx + 1}: {q.questionText}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {q.options.map((opt, oIdx) => (
                            <label key={oIdx} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name={`test-${test._id}-q-${qIdx}`} 
                                checked={answers[test._id]?.[qIdx] === oIdx + 1}
                                onChange={() => handleAnswerSelect(test._id, qIdx, oIdx)}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => handleSubmitTest(test._id)} className="ims-btn-primary" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}>
                      Submit Test
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '1rem', borderTop: '1px solid #e2ece4', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#234731', marginBottom: '0.5rem' }}>Student Submissions & Marks:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '150px', overflowY: 'auto' }}>
                    {results.filter(r => (r.test?._id || r.test || r.testId) === test._id).length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: '#7a9a85' }}>No submissions yet.</p>
                    ) : (
                      results.filter(r => (r.test?._id || r.test || r.testId) === test._id).map((res, rIdx) => (
                        <div key={rIdx} style={{ fontSize: '0.8rem', background: '#f4f8f5', padding: '0.5rem', borderRadius: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{res.student?.name || res.student?.email || 'Student'}</span>
                          <span style={{ fontWeight: 600, color: '#15803d' }}>Score: {res.score} / {res.totalMarks || test.questions?.length || 1}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}