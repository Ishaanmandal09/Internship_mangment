import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', color: '#b91c1c', fontSize: '0.85rem', width: '100%' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#3b6e51', marginBottom: '0.5srem' }}>Email Address</label>
            <div style={{ position: 'relative', width: '100%', marginBottom: '1.25rem' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7a9a85', zIndex: 10 }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" className="ims-input" style={{ paddingLeft: '2.75rem' }} />
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#3b6e51', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative', width: '100%', marginBottom: '1.25rem' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7a9a85', zIndex: 10 }} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="ims-input" style={{ paddingLeft: '2.75rem' }} />
            </div>
          </div>

          <button type="submit" className="ims-btn-primary">Sign In</button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#5a7665' }}>
          Don't have an account? <Link to="/register" style={{ color: '#3b6e51', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}