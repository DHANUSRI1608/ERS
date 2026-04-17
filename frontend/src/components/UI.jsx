// ─── Icon ──────────────────────────────────────────────────────────────────
export const Icon = ({ name, size = 18, className = '', style = {} }) => {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
    reports:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    upload:    <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chart:     <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    builder:   <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>,
    bell:      <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    up:        <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    down:      <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    download:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check:     <><polyline points="20 6 9 17 4 12"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    trash:     <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    menu:      <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}>
      {paths[name] || null}
    </svg>
  );
};

// ─── Badge ─────────────────────────────────────────────────────────────────
const BADGE = {
  ADMIN:        { bg: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', border: 'rgba(168, 85, 247, 0.3)' },
  ANALYST:      { bg: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: 'rgba(59, 130, 246, 0.3)' },
  EMPLOYEE:     { bg: 'rgba(148, 163, 184, 0.2)', color: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)' },
  ACTIVE:       { bg: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' },
  INACTIVE:     { bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' },
  SUCCESS:      { bg: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' },
  FAILED:       { bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' },
  EXCELLENT:    { bg: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: 'rgba(59, 130, 246, 0.3)' },
  GOOD:         { bg: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' },
  AVERAGE:      { bg: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', border: 'rgba(245, 158, 11, 0.3)' },
  BELOW_AVERAGE:{ bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' },
};
export const Badge = ({ value }) => {
  const s = BADGE[value] || { bg: 'rgba(148, 163, 184, 0.2)', color: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:600, background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
      {String(value || '').replace(/_/g, ' ')}
    </span>
  );
};

// ─── Spinner ───────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const dim = { sm: 16, md: 24, lg: 40 }[size] || 24;
  const bw  = size === 'lg' ? 3 : 2;
  return (
    <div style={{ width:dim, height:dim, borderRadius:'50%', border:`${bw}px solid var(--border-light)`, borderTopColor:'var(--primary-accent)', animation:'spin .8s linear infinite', flexShrink:0 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── KPI Card ──────────────────────────────────────────────────────────────
const KPI_GRAD = {
  blue:    'linear-gradient(135deg,#3b82f6,#2563eb)',
  violet:  'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  emerald: 'linear-gradient(135deg,#10b981,#059669)',
  amber:   'linear-gradient(135deg,#f59e0b,#d97706)',
};

export const KPICard = ({ title, value, change, icon, color = 'blue', subtitle }) => {
  const up = parseFloat(change) >= 0;
  return (
    <div className="glass-card" style={{ padding:24 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ width:48, height:48, borderRadius:14, background: KPI_GRAD[color], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:`0 4px 12px rgba(0,0,0,.2)`, flexShrink:0 }}>
          <Icon name={icon} size={22} />
        </div>
        {change !== undefined && (
          <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700, padding:'6px 10px', borderRadius:20, background: up ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: up ? '#34d399' : '#f87171', border: `1px solid ${up ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
            <Icon name={up ? 'up' : 'down'} size={12} />
            {Math.abs(parseFloat(change))}%
          </span>
        )}
      </div>
      <p style={{ fontSize:28, fontWeight:800, color:'var(--text-primary)', marginBottom:4, letterSpacing:'-0.5px' }}>{value}</p>
      <p style={{ fontSize:14, fontWeight:500, color:'var(--text-secondary)' }}>{title}</p>
      {subtitle && <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>{subtitle}</p>}
    </div>
  );
};

// ─── Chart Card ────────────────────────────────────────────────────────────
export const ChartCard = ({ title, subtitle, children, action }) => (
  <div className="glass-card" style={{ padding:24, display:'flex', flexDirection:'column' }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
      <div>
        <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', margin:0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:4, margin:0 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
    <div style={{ flex:1 }}>
      {children}
    </div>
  </div>
);

// ─── Avatar ────────────────────────────────────────────────────────────────
export const Avatar = ({ name = '?', size = 32 }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', background:'linear-gradient(135deg, var(--primary-accent), #8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:size > 36 ? 15 : 13, flexShrink:0, border:'2px solid var(--bg-surface)' }}>
    {String(name)[0].toUpperCase()}
  </div>
);

// ─── EmptyState ────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = 'info', message = 'No data found' }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'64px 0', color:'var(--text-muted)' }}>
    <Icon name={icon} size={48} style={{ opacity:.3, marginBottom:16 }} />
    <p style={{ fontSize:15, color:'var(--text-secondary)', fontWeight:500 }}>{message}</p>
  </div>
);

// ─── ErrorBanner ───────────────────────────────────────────────────────────
export const ErrorBanner = ({ message, onDismiss }) => (
  <div style={{ padding:'12px 16px', borderRadius:'var(--radius-md)', background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.3)', display:'flex', alignItems:'center', gap:10, color:'#fca5a5', fontSize:14, marginBottom:20, boxShadow:'0 4px 12px rgba(239, 68, 68, 0.1)' }}>
    <Icon name="info" size={16} style={{ flexShrink:0 }} />
    <span style={{ flex:1 }}>{message}</span>
    {onDismiss && <button onClick={onDismiss} style={{ background:'none', border:'none', cursor:'pointer', color:'#fca5a5', display:'flex', padding:4, borderRadius:4 }} onMouseOver={e => e.currentTarget.style.background='rgba(239, 68, 68, 0.2)'} onMouseOut={e => e.currentTarget.style.background='none'}><Icon name="x" size={14} /></button>}
  </div>
);

// ─── PageHeader ────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
    <div>
      <h1 style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', margin:0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize:14, color:'var(--text-muted)', marginTop:4, margin:0 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── Btn ───────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = 'primary', disabled, icon, size = 'md', style = {} }) => {
  const pad = size === 'sm' ? '8px 14px' : '10px 20px';
  const fs  = size === 'sm' ? 13 : 14;
  
  const baseStyle = { display:'inline-flex', alignItems:'center', gap:8, padding:pad, borderRadius:'var(--radius-md)', fontWeight:600, fontSize:fs, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, transition:'all var(--transition-fast)', ...style };

  let variantStyle = {};
  if (variant === 'primary') {
    variantStyle = { background:'var(--primary-accent)', color:'#fff', border:'none', boxShadow:'0 4px 10px rgba(59, 130, 246, 0.3)' };
  } else if (variant === 'success') {
    variantStyle = { background:'var(--accent-success)', color:'#fff', border:'none', boxShadow:'0 4px 10px rgba(16, 185, 129, 0.3)' };
  } else if (variant === 'danger') {
    variantStyle = { background:'var(--accent-danger)', color:'#fff', border:'none', boxShadow:'0 4px 10px rgba(239, 68, 68, 0.3)' };
  } else if (variant === 'ghost') {
    variantStyle = { background:'rgba(255,255,255,0.05)', color:'var(--text-primary)', border:'1px solid var(--border-light)' };
  }

  return (
    <button onClick={onClick} disabled={disabled} style={{ ...baseStyle, ...variantStyle }}
      onMouseOver={e => { if(!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseOut={e => { if(!disabled) e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
};

// ─── Modal ─────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, children }) => (
  <div className="animate-fade-in" style={{ position:'fixed', inset:0, background:'rgba(15, 23, 42, 0.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
    <div className="glass-panel" style={{ width:'100%', maxWidth:500, overflow:'hidden', border:'1px solid var(--border-heavy)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--border-light)', background:'rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontWeight:700, fontSize:18, color:'var(--text-primary)', margin:0 }}>{title}</h3>
        <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'var(--text-secondary)', display:'flex', padding:6, transition:'all var(--transition-fast)' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
          <Icon name="x" size={18} />
        </button>
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  </div>
);

// ─── Input ─────────────────────────────────────────────────────────────────
export const Input = ({ label, value, onChange, type = 'text', placeholder, ...props }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-premium" {...props} />
  </div>
);

// ─── Select ────────────────────────────────────────────────────────────────
export const Select = ({ label, value, onChange, options, ...props }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>{label}</label>}
    <select value={value} onChange={onChange} className="input-premium" {...props} style={{ cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px top 50%', backgroundSize: '10px auto' }}>
      {options.map(o => <option key={o.value || o} value={o.value || o} style={{ background: '#1e293b' }}>{o.label || o}</option>)}
    </select>
  </div>
);
