import { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Trash2, UserCheck, Briefcase } from 'lucide-react';

export default function AdminUsers() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setTeachers(data.teachers || []);
      setStudents(data.students || []);
      setInternships(data.internships || []);
      
      const validEnrollments = (data.enrollments || []).filter(
        en => en.student && en.internship && (!en.status || en.status === 'pending')
      );
      setEnrollments(validEnrollments);
    } catch (err) {
      setError('Failed to fetch user management data');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/user/${userId}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleAllocateTeacher = async (teacherId) => {
    const internshipId = allocations[teacherId];
    if (!internshipId) return alert("Please select an internship");
    try {
      await API.post('/admin/allocate-teacher', { 
        teacherId, 
        internshipId 
      });
      alert("Teacher allocated to internship successfully!");
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Teacher allocation failed');
    }
  };

  const handleEnrollmentStatus = async (enrollmentId, status) => {
    try {
      await API.put('/admin/enrollment', { enrollmentId, status });
      alert(`Enrollment successfully ${status}!`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update enrollment status');
    }
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users color="#3b6e51" size={32} /> User & Enrollment Management
        </h1>
        <p style={{ color: '#5a7665', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
          Manage teacher allocations and review student program enrollments.
        </p>
      </header>

      {error && <div style={{ color: '#b91c1c', marginBottom: '1rem' }}>{error}</div>}

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#274d35', marginBottom: '1rem' }}>Teachers List & Allocation</h2>
        <div className="dashboard-grid">
          {teachers.map(t => (
            <div key={t._id} className="ims-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#1b3826', fontWeight: 700 }}>{t.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#5a7665' }}>{t.email}</p>
                </div>
                <button onClick={() => handleDeleteUser(t._id)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select 
                  className="ims-input"
                  value={allocations[t._id] || ''}
                  onChange={(e) => setAllocations({ ...allocations, [t._id]: e.target.value })}
                >
                  <option value="">Select Internship to Assign</option>
                  {internships.map(i => (
                    <option key={i._id} value={i._id}>{i.title}</option>
                  ))}
                </select>
                <button onClick={() => handleAllocateTeacher(t._id)} className="ims-btn-primary" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
                  Allocate
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#274d35', marginBottom: '1rem' }}>Students Directory</h2>
        <div className="dashboard-grid">
          {students.map(s => (
            <div key={s._id} className="ims-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#1b3826', fontWeight: 700 }}>{s.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#5a7665' }}>{s.email}</p>
              </div>
              <button onClick={() => handleDeleteUser(s._id)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#274d35', marginBottom: '1rem' }}>Student Internship Enrollments Review</h2>
        <div className="dashboard-grid">
          {enrollments.map(en => (
            <div key={en._id} className="ims-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#274d35', fontWeight: 700 }}>
                  {en.student?.name} &rarr; {en.internship?.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#5a7665' }}>
                  Status: <strong style={{ textTransform: 'capitalize' }}>{en.status}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEnrollmentStatus(en._id, 'approved')} style={{ background: '#274d35', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer' }}>Approve</button>
                <button onClick={() => handleEnrollmentStatus(en._id, 'rejected')} style={{ background: '#b91c1c', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer' }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}