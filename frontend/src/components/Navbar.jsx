import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(163, 193, 173, 0.4)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(46, 74, 58, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#2d5a3f', letterSpacing: '-0.01em' }}>
        IMS Portal <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#5a7665' }}>({user.role})</span>
      </div>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/dashboard" style={{ color: '#3b6e51', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Dashboard</Link>
        <Link to="/internships" style={{ color: '#3b6e51', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Internships</Link>
        <Link to="/materials" style={{ color: '#3b6e51', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Materials</Link>
        <Link to="/tests" style={{ color: '#3b6e51', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Tests</Link>
        <Link to="/schedules" style={{ color: '#3b6e51', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Schedules</Link>
        <Link to="/attendance" style={{ color: '#3b6e51', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Attendance</Link>
        
        {user?.role === 'admin' && (
          <Link to="/admin/users" style={{ color: '#274d35', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', background: '#e4efe7', padding: '0.35rem 0.75rem', borderRadius: '0.4rem' }}>
            Manage Users
          </Link>
        )}
        
        <button 
          onClick={() => { logout(); navigate('/login'); }}
          style={{
            background: '#e9f2ec',
            color: '#2d5a3f',
            border: '1px solid #c2d5c5',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}