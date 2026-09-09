import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Trash2, Calendar } from 'lucide-react';

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchInternships();
    if (user?.role === 'student') {
      fetchMyEnrollments();
    }
  }, [user]);

  const fetchInternships = async () => {
    try {
      const { data } = await API.get('/internships');
      setInternships(data || []);
    } catch (err) {
      setError('Failed to fetch internships');
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      // Tries common paths for student enrollments
      const { data } = await API.get('/enrollments/my-status').catch(() => API.get('/enrollments'));
      const ids = (data || []).map(e => {
        const target = e.internshipId || e.internship;
        return typeof target === 'object' ? target?._id : target;
      }).filter(Boolean);
      setEnrolledIds(ids);
    } catch (err) {
      console.error('Could not fetch enrollment statuses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/internships', formData);
      setFormData({ title: '', description: '', startDate: '', endDate: '' });
      fetchInternships();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create internship');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;
    try {
      await API.delete(`/admin/internship/${id}`);
      fetchInternships();
    } catch (err) {
      setError('Failed to delete internship');
    }
  };

  const handleEnroll = async (internshipId) => {
    try {
      await API.post('/enrollments', { internshipId });
      // Instantly add to local state so the card hides right away
      setEnrolledIds(prev => [...prev, internshipId]);
      alert('Enrollment request submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit enrollment request');
    }
  };

  const displayedInternships = user?.role === 'student'
    ? internships.filter(item => !enrolledIds.includes(item._id))
    : internships;

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase color="#3b6e51" size={32} /> Internships Directory
        </h1>
        <p style={{ color: '#5a7665', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
          Browse and manage active training programs and enrollments.
        </p>
      </header>

      {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}

      {user?.role === 'admin' && (
        <form onSubmit={handleSubmit} className="ims-card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#234731' }}>Create Internship</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="ims-input" />
            <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required className="ims-input" />
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required className="ims-input" />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required className="ims-input" />
          </div>
          <button type="submit" className="ims-btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>Publish Internship</button>
        </form>
      )}

      <div className="dashboard-grid">
        {displayedInternships.length === 0 ? (
          <p style={{ color: '#5a7665', gridColumn: '1 / -1' }}>No active internships available or you have already enrolled in all available programs.</p>
        ) : (
          displayedInternships.map((item) => (
            <div key={item._id} className="ims-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1b3826', marginBottom: '0.35rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#5a7665', marginBottom: '0.5rem' }}>{item.description}</p>
                <p style={{ fontSize: '0.8rem', color: '#7a9a85', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                </p>
                
                {user?.role === 'student' && (
                  <button 
                    onClick={() => handleEnroll(item._id)} 
                    className="ims-btn-primary" 
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem', width: 'auto' }}
                  >
                    Enroll Now
                  </button>
                )}
              </div>

              {user?.role === 'admin' && (
                <button onClick={() => handleDelete(item._id)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer' }} title="Delete Internship">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}