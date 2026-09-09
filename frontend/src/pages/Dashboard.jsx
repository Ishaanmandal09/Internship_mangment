import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Users, Calendar, FileText, CheckSquare, Award, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [counts, setCounts] = useState({
    internships: '0 Active',
    students: '0 Registered',
    schedules: '0 Upcoming',
    tests: '0 Available'
  });
  const [myEnrollments, setMyEnrollments] = useState([]);
  const location = useLocation();
useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        if (user?.role === 'student') {
          const enrollRes = await axios.get('http://localhost:5000/api/enrollments', { headers }).catch(() => null);
          if (enrollRes && Array.isArray(enrollRes.data)) {
            setMyEnrollments(enrollRes.data);
          }
        } else {
          // Fetch live statistics and log errors if they occur
          const statsRes = await axios.get('http://localhost:5000/api/admin/stats', { headers }).catch((err) => {
            console.error("Stats API Error Status:", err.response?.status, err.response?.data);
            return null;
          });
          
          if (statsRes && statsRes.data) {
            const { totalStudents, internships } = statsRes.data;
            
            const testsRes = await axios.get('http://localhost:5000/api/tests', { headers }).catch(() => null);
            const schedulesRes = await axios.get('http://localhost:5000/api/schedules', { headers }).catch(() => null);

            setCounts({
              internships: `${internships?.length || 0} Active`,
              students: `${totalStudents || 0} Registered`,
              schedules: `${schedulesRes?.data?.length || 0} Upcoming`,
              tests: `${testsRes?.data?.length || 0} Available`
            });
          }
        }
      } catch (err) {
        console.error('Error loading dashboard data', err);
      }
    };
    fetchDashboardData();
  }, [user, location]);

  const adminStats = [
    { title: 'Total Internships', count: counts.internships, icon: Briefcase },
    { title: 'Enrolled Students', count: counts.students, icon: Users },
    { title: 'Scheduled Sessions', count: counts.schedules, icon: Calendar },
    { title: 'Tests & Evaluations', count: counts.tests, icon: Award },
  ];

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35' }}>
            {user?.role === 'student' ? 'Student Portal Dashboard' : 'Dashboard Overview'}
          </h1>
          <p style={{ color: '#5a7665', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
            Welcome back, {user?.name || 'User'} <span style={{ textTransform: 'capitalize' }}>({user?.role})</span>
          </p>
        </div>
      </header>

      {user?.role === 'student' ? (
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="ims-card" style={{ marginBottom: '1.5rem', background: '#e4efe7' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#234731', marginBottom: '0.5rem' }}>My Active Enrollments</h2>
            <p style={{ fontSize: '0.95rem', color: '#3b6e51' }}>
              You are currently enrolled in <strong>{myEnrollments.length}</strong> internship program(s).
            </p>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          {adminStats.map(({ title, count, icon: Icon }) => (
            <div key={title} className="ims-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '0.25rem', fontSize: '0.9rem', color: '#5a7665', fontWeight: 600 }}>{title}</h3>
                  <p style={{ fontSize: '1.85rem', fontWeight: 700, color: '#274d35' }}>{count}</p>
                </div>
                <div style={{ padding: '0.75rem', background: '#e4efe7', borderRadius: '0.75rem', color: '#3b6e51' }}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#274d35', marginBottom: '1.25rem' }}>
          System Modules & Quick Actions
        </h2>
        
        <div className="dashboard-grid">
          <Link to="/internships" className="ims-card" style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#e4efe7', color: '#3b6e51', borderRadius: '0.75rem' }}><Briefcase size={22} /></div>
              <ArrowRight size={20} style={{ color: '#7a9a85' }} />
            </div>
            <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '0.35rem', fontSize: '1.1rem', color: '#234731', fontWeight: 700 }}>Internships Portal</h3>
            <p style={{ fontSize: '0.875rem', color: '#5a7665', lineHeight: 1.5 }}>Explore programs and manage your internship enrollments.</p>
          </Link>

          <Link to="/materials" className="ims-card" style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#e4efe7', color: '#3b6e51', borderRadius: '0.75rem' }}><FileText size={22} /></div>
              <ArrowRight size={20} style={{ color: '#7a9a85' }} />
            </div>
            <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '0.35rem', fontSize: '1.1rem', color: '#234731', fontWeight: 700 }}>Study Materials</h3>
            <p style={{ fontSize: '0.875rem', color: '#5a7665', lineHeight: 1.5 }}>Access reference guides, documentation, and resources.</p>
          </Link>

          <Link to="/tests" className="ims-card" style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#e4efe7', color: '#3b6e51', borderRadius: '0.75rem' }}><Award size={22} /></div>
              <ArrowRight size={20} style={{ color: '#7a9a85' }} />
            </div>
            <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '0.35rem', fontSize: '1.1rem', color: '#234731', fontWeight: 700 }}>Tests & Quizzes</h3>
            <p style={{ fontSize: '0.875rem', color: '#5a7665', lineHeight: 1.5 }}>Take evaluations and review submission results.</p>
          </Link>

          <Link to="/schedules" className="ims-card" style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#e4efe7', color: '#3b6e51', borderRadius: '0.75rem' }}><Calendar size={22} /></div>
              <ArrowRight size={20} style={{ color: '#7a9a85' }} />
            </div>
            <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '0.35rem', fontSize: '1.1rem', color: '#234731', fontWeight: 700 }}>Schedules</h3>
            <p style={{ fontSize: '0.875rem', color: '#5a7665', lineHeight: 1.5 }}>View upcoming workshops, mentoring sessions, and timetables.</p>
          </Link>

          <Link to="/attendance" className="ims-card" style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#e4efe7', color: '#3b6e51', borderRadius: '0.75rem' }}><CheckSquare size={22} /></div>
              <ArrowRight size={20} style={{ color: '#7a9a85' }} />
            </div>
            <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '0.35rem', fontSize: '1.1rem', color: '#234731', fontWeight: 700 }}>Attendance Tracker</h3>
            <p style={{ fontSize: '0.875rem', color: '#5a7665', lineHeight: 1.5 }}>Check your presence logs and participation records.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}