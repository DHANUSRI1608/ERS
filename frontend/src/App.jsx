import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import UploadPage from './pages/UploadPage';
import BuilderPage from './pages/BuilderPage';
import AdminPage from './pages/AdminPage';

function AppInner() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const location = useLocation();


  const can = p => {
    if (!user) return true;
    if (p === 'upload' || p === 'builder') return ['ADMIN', 'ANALYST'].includes(user.role);
    if (p === 'admin') return user.role === 'ADMIN';
    return true;
  };

  const currentPath = location.pathname.substring(1) || 'dashboard';

  if (!can(currentPath)) return (
    <div className="flex-center" style={{ height: 300, flexDirection: 'column', gap: 8, color: 'var(--text-muted)' }}>
      <p style={{ fontSize: 18, fontWeight: 700 }}>Access Restricted</p>
      <p style={{ fontSize: 14 }}>Your role ({user.role}) cannot access this page.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar user={user} open={open} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        {/* Background ambient light */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(15,23,42,0) 70%)', zIndex: -1, pointerEvents: 'none' }} />

        <Topbar user={user} logout={logout} open={open} setOpen={setOpen} />

        <main className="animate-fade-in" style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/reports" element={user ? <ReportsPage /> : <Navigate to="/login" />} />
            <Route path="/upload" element={user ? <UploadPage /> : <Navigate to="/login" />} />
            <Route path="/builder" element={user ? <BuilderPage /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/login" />} />

            {/* Default route */}
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
