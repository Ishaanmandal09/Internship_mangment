import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Plus, Clock, Trash2 } from 'lucide-react';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    internshipId: '',
    date: '',
    startTime: '',
    endTime: '',
    topic: '',
    description: ''
  });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data } = await API.get('/schedules');
      setSchedules(data);
    } catch (err) {
      setError('Failed to fetch schedules');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/schedules', formData);
      setFormData({ internshipId: '', date: '', startTime: '', endTime: '', topic: '', description: '' });
      fetchSchedules();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create schedule');
    }
  };

const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await API.delete(`/schedules/${id}`);
      // Update local state to remove the item instantly from UI
      setSchedules(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar color="#3b6e51" size={32} /> Class Schedules
        </h1>
        <p style={{ color: '#5a7665', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
          Organize timetables, lecture topics, and classroom schedules.
        </p>
      </header>

      {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <form onSubmit={handleSubmit} className="ims-card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#234731' }}>
            Add Class Schedule
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>Internship ID</label>
              <input type="text" placeholder="Enter Internship ID" value={formData.internshipId} onChange={(e) => setFormData({...formData, internshipId: e.target.value})} required className="ims-input" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>Schedule Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="ims-input" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>Start Time</label>
              <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required className="ims-input" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>End Time</label>
              <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required className="ims-input" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', color: '#5a7665', fontWeight: 600 }}>Lecture Topic</label>
              <input type="text" placeholder="Enter lecture topic" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} required className="ims-input" />
            </div>
          </div>

          <div>
            <button type="submit" className="ims-btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
              Publish Schedule
            </button>
          </div>
        </form>
      )}

      <div className="dashboard-grid">
        {schedules.map((sch) => (
          <div key={sch._id} className="ims-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1b3826', marginBottom: '0.35rem' }}>{sch.topic}</h3>
              <p style={{ fontSize: '0.85rem', color: '#5a7665', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} /> {new Date(sch.date).toLocaleDateString()} | {sch.startTime} - {sch.endTime}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#7a9a85' }}>Internship ID: {sch.internship?.title || sch.internship}</p>
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => handleDelete(sch._id)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer', padding: '0.25rem' }} title="Delete Schedule">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}