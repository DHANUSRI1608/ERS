import { Icon, Avatar } from './UI';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['ADMIN', 'ANALYST', 'EMPLOYEE'] },
  { id: 'reports', label: 'Reports', icon: 'reports', roles: ['ADMIN', 'ANALYST', 'EMPLOYEE'] },
  { id: 'upload', label: 'Data Upload', icon: 'upload', roles: ['ADMIN', 'ANALYST'] },
  { id: 'builder', label: 'Report Builder', icon: 'builder', roles: ['ADMIN', 'ANALYST'] },
  { id: 'admin', label: 'Admin Panel', icon: 'users', roles: ['ADMIN'] },
];

export default function Sidebar({ user, open }) {

  const navigate = useNavigate();
  const location = useLocation();
  if (!user) return null;
  const items = NAV.filter(n => n.roles.includes(user.role));

  const currentPath = location.pathname.substring(1) || 'dashboard';

  return (
    <aside className="sidebar" style={{ width: open ? 220 : 70 }}>
      {/* Logo */}
      <div className="logo">
        <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary-accent), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-md)' }}>
          <Icon name="chart" size={18} style={{ color: '#fff' }} />
        </div>
        {open && <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>ERS <span className="text-gradient">Pro</span></span>}
      </div>

      {/* Nav items */}
      <nav className="sidebar-nav">
        {items.map(item => {
          const active = currentPath === item.id;
          return (
            <button key={item.id} onClick={() => navigate(`/${item.id}`)} className={`sidebar-item ${active ? 'active' : ''}`}>
              <Icon name={item.icon} size={20} style={{ flexShrink: 0 }} />
              {open && <span style={{ flex: 1 }}>{item.label}</span>}
              {open && active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-accent)', flexShrink: 0, boxShadow: '0 0 8px var(--primary-accent)' }} />}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="sidebar-user">
        {open ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}>
            <Avatar name={user.name} size={36} />
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                {user.name?.split(' ')[0]}
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: user.role === 'ADMIN' ? 'rgba(168, 85, 247, 0.2)' : user.role === 'ANALYST' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.2)', color: user.role === 'ADMIN' ? '#c084fc' : user.role === 'ANALYST' ? '#60a5fa' : '#94a3b8', display: 'inline-block', marginTop: 4 }}>
                {user.role}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-center">
            <Avatar name={user.name} size={36} />
          </div>
        )}
      </div>
    </aside>
  );
}
