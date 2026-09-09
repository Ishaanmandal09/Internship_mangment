import { useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, Search, CheckCircle } from 'lucide-react';

export default function Attendance() {
  const [intensiveId, setIntensiveId] = useState('');
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({ student: '', intensive: '', date: '', status: 'Present' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const fetchAttendance = async (id) => {
    if (!id) return;
    try {
      const { data } = await API.get(`/attendance/${id}`);
      setRecords(data);
    } catch (err) {
      setError('Failed to load attendance records');
    }
  };

  const handleMark = async (e) => {
    e.preventDefault();
    try {
      await API.post('/attendance', formData);
      setFormData({ student: '', intensive: '', date: '', status: 'Present' });
      fetchAttendance(formData.intensive);
      alert('Attendance marked successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark attendance');
    }
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckSquare color="#3b6e51" size={32} /> Attendance Management
          </h1>
          <p style={{ color: '#5a7665', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
            Monitor daily presence, absence records, and student participation rates.
          </p>
        </div>
      </header>

      {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}

      <div className="ims-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Enter Intensive ID to view records" 
            value={intensiveId} 
            onChange={(e) => setIntensiveId(e.target.value)} 
            className="ims-input"
            style={{ flex: 1 }}
          />
          <button 
            onClick={() => fetchAttendance(intensiveId)} 
            className="ims-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0 1.5rem' }}
          >
            <Search size={18} /> Load Records
          </button>
        </div>
      </div>

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <form onSubmit={handleMark} className="ims-card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#234731' }}>Mark Student Attendance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <input type="text" placeholder="Student ID" value={formData.student} onChange={(e) => setFormData({...formData, student: e.target.value})} required className="ims-input" />
            <input type="text" placeholder="Intensive ID" value={formData.intensive} onChange={(e) => setFormData({...formData, intensive: e.target.value})} required className="ims-input" />
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="ims-input" />
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="ims-input">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
          <button type="submit" className="ims-btn-primary" style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 1.5rem' }}>
            <CheckCircle size={18} /> Submit Attendance
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {records.map((rec) => (
          <div key={rec._id} className="ims-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1b3826' }}>{rec.student?.name || 'Student Record'}</h3>
              <p style={{ fontSize: '0.8rem', color: '#5a7665', marginTop: '0.2rem' }}>Date: {new Date(rec.date).toLocaleDateString()}</p>
            </div>
            <span style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '2rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: rec.status === 'Present' ? '#e4efe7' : rec.status === 'Absent' ? '#fde8e8' : '#fef3c7',
              color: rec.status === 'Present' ? '#274d35' : rec.status === 'Absent' ? '#9b1c1c' : '#92400e',
              border: `1px solid ${rec.status === 'Present' ? '#c2d5c5' : rec.status === 'Absent' ? '#f8b4b4' : '#fde68a'}`,
              whiteSpace: 'nowrap'
            }}>
              {rec.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}