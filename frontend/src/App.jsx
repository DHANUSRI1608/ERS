import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';
import DataUpload from './pages/DataUpload';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 transition-colors duration-300">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {user && <Navbar />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            
            {/* Analyst & Admin Routes */}
            <Route path="/analytics" element={
              <RoleRoute allowedRoles={['ADMIN', 'ANALYST']}><Analytics /></RoleRoute>
            } />
            <Route path="/reports" element={
              <RoleRoute allowedRoles={['ADMIN', 'ANALYST']}><Reports /></RoleRoute>
            } />
            <Route path="/data-upload" element={
              <RoleRoute allowedRoles={['ADMIN', 'ANALYST', 'EMPLOYEE']}><DataUpload /></RoleRoute>
            } />

            {/* Admin Only Routes */}
            <Route path="/users" element={
              <RoleRoute allowedRoles={['ADMIN']}><UserManagement /></RoleRoute>
            } />
            <Route path="/audit" element={
              <RoleRoute allowedRoles={['ADMIN']}><AuditLogs /></RoleRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
