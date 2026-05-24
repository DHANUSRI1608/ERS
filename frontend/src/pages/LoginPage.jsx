import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Icon, Spinner } from '../components/UI';

const QUICK = [
  { label:'Admin',    email:'arjun@corp.com',   pw:'admin123',   grad:'linear-gradient(135deg,#7c3aed,#6d28d9)', hint:'Full access' },
  { label:'Analyst',  email:'priya@corp.com',   pw:'analyst123', grad:'linear-gradient(135deg,#2563eb,#1d4ed8)', hint:'Upload + Reports' },
  { label:'Employee', email:'karthik@corp.com', pw:'emp123',     grad:'linear-gradient(135deg,#475569,#334155)', hint:'View only' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const doLogin = async (e, p) => {
    if (!e || !p) { setError('Enter email and password'); return; }
    setLoading(true); setError('');
    try { await login(e, p); }
    catch (err) { setError(err.response?.data?.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-grid" style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)', fontFamily:"'DM Sans',sans-serif" }}>

      {/* Left panel */}
      <div className="login-left" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:64, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 50%,rgba(99,102,241,.18) 0%,transparent 65%)' }} />
        <div className="login-hero" style={{ maxWidth:460 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:48 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="chart" size={22} style={{ color:'#fff' }} />
            </div>
            <span style={{ fontSize:22, fontWeight:900, color:'#fff' }}>ERS <span style={{ color:'#60a5fa' }}>Enterprise</span></span>
          </div>
          <h1 style={{ fontSize:48, fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            Turn Data Into<br />
            <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Decisions
            </span>
          </h1>
          <p style={{ color:'#94a3b8', fontSize:16, lineHeight:1.7, marginBottom:36 }}>
            Upload business data, visualize trends, generate reports — all connected to a live PostgreSQL database with JWT authentication.
          </p>
          {[
            { icon:'upload',    text:'Excel/CSV ingestion with full validation' },
            { icon:'dashboard', text:'Live KPI dashboards from real DB data' },
            { icon:'users',     text:'Role-based access: Admin · Analyst · Employee' },
          ].map(f => (
            <div key={f.icon} className="login-feature">
              <div className="login-feature-icon">
                <Icon name={f.icon} size={15} />
              </div>
              <span style={{ fontSize:14, color:'#cbd5e1' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right" style={{ flex:1, maxWidth:440, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div style={{ width:'100%', maxWidth:360 }}>
          <div className="login-card">
            <h2 style={{ fontSize:22, fontWeight:800, color:'#fff', marginBottom:6 }}>Sign in</h2>
            <p style={{ fontSize:13, color:'#94a3b8', marginBottom:24 }}>Access your reporting workspace</p>

            {error && (
              <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:12, background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.25)', display:'flex', alignItems:'center', gap:8, color:'#fca5a5', fontSize:13 }}>
                <Icon name="info" size={14} />{error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key==='Enter' && doLogin(email, password)}
                placeholder="you@company.com"
                style={{ width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:'12px 16px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            {/* Password */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key==='Enter' && doLogin(email, password)}
                placeholder="••••••••"
                style={{ width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:'12px 16px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            <button onClick={() => doLogin(email, password)} disabled={loading}
              style={{ width:'100%', background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', border:'none', borderRadius:12, padding:'13px', color:'#fff', fontWeight:700, fontSize:14, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity: loading ? .7 : 1 }}>
              {loading ? <><Spinner size="sm" /> Authenticating…</> : 'Sign In'}
            </button>

            {/* Quick demo login */}
            <div className="quick-login">
              <strong>⚡ Quick Demo Login</strong>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {QUICK.map(q => (
                  <button key={q.label} onClick={() => doLogin(q.email, q.pw)} disabled={loading}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 14px', borderRadius:10, border:'none', background:q.grad, color:'#fff', fontWeight:700, fontSize:12, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .5 : 1 }}>
                    <span>{q.label}</span>
                    <span style={{ opacity:.75 }}>{q.hint} →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
