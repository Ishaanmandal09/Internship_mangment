import { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Trash2, CheckCircle, XCircle, Shield, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalTeachers: 0, totalStudents: 0, teachers: [], students: [], internships: [], enrollments: [] });
  const [allocation, setAllocation] = useState({ userId: '', internshipId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (err) {
      setError('Failed to load admin dashboard data');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/user/${userId}`);
      fetchStats();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleEnrollmentAction = async (enrollmentId, status) => {
    try {
      await API.put('/admin/enrollment', { enrollmentId, status });
      fetchStats();
    } catch (err) {
      setError('Failed to update enrollment status');
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/allocate', allocation);
      setSuccess('User successfully allocated to internship!');
      setAllocation({ userId: '', internshipId: '' });
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to allocate user');
    }
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield color="#3b6e51" size={32} /> Admin Control Center
        </h1>
        <p style={{ color: '#5a7665', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
          Manage teachers, students, internship allocations, and enrollment confirmations.
        </p>
      </header>

      {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}
      {success && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(21, 128, 61, 0.1)', border: '1px solid rgba(21, 128, 61, 0.3)', borderRadius: '0.75rem', color: '#15803d', fontSize: '0.9rem' }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="ims-card">
          <h3 style={{ color: '#5a7665', fontSize: '0.85rem' }}>Total Teachers</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#274d35' }}>{stats.totalTeachers}</p>
        </div>
        <div className="ims-card">
          <h3 style={{ color: '#5a7665', fontSize: '0.85rem' }}>Total Students</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#274d35' }}>{stats.totalStudents}</p>
        </div>
      </div>

      <form onSubmit={handleAllocate} className="ims-card" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#234731', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={20} /> Allocate User to Internship
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <select value={allocation.userId} onChange={(e) => setAllocation({...allocation, userId: e.target.value})} required className="ims-input">
            <option value="">Select User (Teacher/Student)</option>
            <optgroup label="Teachers">
              {stats.teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
            </optgroup>
            <optgroup label="Students">
              {stats.students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
            </optgroup>
          </select>
          <select value={allocation.internshipId} onChange={(e) => setAllocation({...allocation, internshipId: e.target.value})} required className="ims-input">
            <option value="">Select Internship</option>
            {stats.internships.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
          </select>
        </div>
        <button type="submit" className="ims-btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>Confirm Allocation</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="ims-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#234731' }}>Teachers Directory ({stats.teachers.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
            {stats.teachers.map((t) => (
              <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f4f8f5', borderRadius: '0.5rem' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1b3826' }}>{t.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#5a7665' }}>{t.email}</p>
                </div>
                <button onClick={() => handleDeleteUser(t._id)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="ims-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#234731' }}>Students Directory ({stats.students.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
            {stats.students.map((s) => (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f4f8f5', borderRadius: '0.5rem' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1b3826' }}>{s.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#5a7665' }}>{s.email}</p>
                </div>
                <button onClick={() => handleDeleteUser(s._id)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ims-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#234731' }}>Student Enrollment Confirmations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {stats.enrollments.map((en) => (
            <div key={en._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f4f8f5', borderRadius: '0.75rem', border: '1px solid #d4e4d7' }}>
              <div>
                <p style={{ fontWeight: 600, color: '#1b3826' }}>{en.student?.name} ({en.student?.email})</p>
                <p style={{ fontSize: '0.85rem', color: '#5a7665' }}>Requested Internship: {en.internship?.title || 'Internship'}</p>
                <p style={{ fontSize: '0.75rem', color: en.status === 'approved' ? '#15803d' : '#b45309', fontWeight: 600, marginTop: '0.25rem' }}>Status: {en.status.toUpperCase()}</p>
              </div>
              {en.status !== 'approved' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEnrollmentAction(en._id, 'approved')} style={{ background: '#15803d', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                    <CheckCircle size={16} /> Confirm
                  </button>
                  <button onClick={() => handleEnrollmentAction(en._id, 'rejected')} style={{ background: '#b91c1c', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}