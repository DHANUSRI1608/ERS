import { useState } from 'react';
import { Icon, Avatar } from './UI';

export default function Topbar({ user, logout, open, setOpen }) {
  const [notif, setNotif] = useState(false);
  if (!user) return null;
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => setOpen(!open)} className="btn-secondary menu-btn" aria-label="Toggle sidebar" style={{ padding: 8, minWidth: 40, minHeight: 40 }}>
          <Icon name="menu" size={20} />
        </button>
        <div className="topbar-search">
          <Icon name="search" size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input placeholder="Search enterprise resources..." />
        </div>
      </div>

      <div className="topbar-actions">
        <div style={{ position: 'relative' }}>
          <button onClick={() => setNotif(!notif)} className="notification-btn">
            <Icon name="bell" size={18} />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: 'var(--accent-danger)', borderRadius: '50%', border: '2px solid var(--bg-surface)' }} />
          </button>

          {notif && (
            <div className="notification-panel">
              <div className="glass-panel animate-fade-in" style={{ position: 'relative', width: 320, overflow: 'hidden', zIndex: 50 }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>System Alerts</span>
                  <span style={{ fontSize: 12, fontWeight: 700, background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary-accent)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>3 New</span>
                </div>
                {[
                  { msg: 'Data ingestion processed successfully', time: '2 min ago', icon: 'upload', color: 'var(--accent-success)' },
                  { msg: 'Q4 Executive Report generation complete', time: '1 hr ago', icon: 'reports', color: 'var(--primary-accent)' },
                  { msg: 'System configuration updated', time: '3 hr ago', icon: 'dashboard', color: 'var(--accent-warning)' },
                ].map((n, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '16px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: n.color }}>
                      <Icon name={n.icon} size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', margin: 0, marginBottom: 4 }}>{n.msg}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid var(--border-light)', marginLeft: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, marginBottom: 2 }}>{user.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{user.department}</p>
          </div>
          <Avatar name={user.name} size={40} />
          <button onClick={logout} title="Secure Logout" className="logout-btn"
            onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-danger)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
