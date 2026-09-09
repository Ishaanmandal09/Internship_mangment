import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Internships from './pages/Internships';
import Materials from './pages/Materials';
import Tests from './pages/Tests';
import Schedules from './pages/Schedules';
import Attendance from './pages/Attendance';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import AdminUsers from './pages/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}