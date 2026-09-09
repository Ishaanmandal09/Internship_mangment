import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <form onSubmit={handleSubmit} className="ims-card" style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: '#e4efe7', borderRadius: '50%', color: '#274d35', marginBottom: '0.75rem' }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1b3826' }}>Register for Intensive IMS</h2>
          <p style={{ fontSize: '0.9rem', color: '#5a7665', marginTop: '0.25rem' }}>Create your account to get started</p>
        </div>

        {error && <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', color: '#b91c1c', fontSize: '0.875rem' }}>{error}</div>}
        
        <div style={{ marginBottom: '1.15rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#234731', marginBottom: '0.4rem' }}>Full Name</label>
          <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="ims-input" />
        </div>

        <div style={{ marginBottom: '1.15rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#234731', marginBottom: '0.4rem' }}>Email Address</label>
          <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required className="ims-input" />
        </div>

        <div style={{ marginBottom: '1.15rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#234731', marginBottom: '0.4rem' }}>Password</label>
          <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="ims-input" />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#234731', marginBottom: '0.4rem' }}>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="ims-input">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <button type="submit" className="ims-btn-primary" style={{ width: '100%' }}>
          Register Account
        </button>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: '#5a7665' }}>
          Already have an account? <Link to="/login" style={{ color: '#274d35', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </form>
    </div>
  );
}