import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Users, Settings, LogOut, History, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'ANALYST', 'EMPLOYEE'] },
    { to: '/reports', name: 'Reports', icon: <FileText size={20} />, roles: ['ADMIN', 'ANALYST'] },
    { to: '/analytics', name: 'Analytics', icon: <BarChart3 size={20} />, roles: ['ADMIN', 'ANALYST'] },
    { to: '/users', name: 'User Management', icon: <Users size={20} />, roles: ['ADMIN'] },
    { to: '/settings', name: 'Settings', icon: <Settings size={20} />, roles: ['ADMIN', 'ANALYST', 'EMPLOYEE'] },
    { to: '/audit', name: 'Audit Logs', icon: <History size={20} />, roles: ['ADMIN'] },
    { to: '/data-upload', name: 'Data Import', icon: <Database size={20} />, roles: ['ADMIN', 'ANALYST', 'EMPLOYEE'] },
  ];

  const filteredLinks = links.filter(link => user && link.roles.includes(user.role));

  return (
    <div className="w-64 bg-primary text-white flex flex-col h-full shadow-2xl transition-colors duration-300">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-tight text-accent">ERS Enterprise</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-accent text-white' : 'hover:bg-secondary text-slate-400'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full p-3 text-slate-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
