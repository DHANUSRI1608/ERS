import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 glass z-10 flex items-center justify-between px-8 border-b transition-colors duration-300">
      <div className="text-sm text-slate-500 font-medium">
        Welcome back, <span className="text-slate-900 font-bold">{user?.username}</span>
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-slate-500 hover:text-accent transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 border-l pl-6">
          <div className="text-right">
            <p className="text-sm font-bold leading-none">{user?.username}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center border-2 border-accent/20">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
