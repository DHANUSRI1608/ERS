import { useState, useEffect } from 'react';
import { apiGetReports, apiSaveReport, apiDeleteReport, apiGetEmployees } from '../services/api';
import { Icon, Badge, Spinner, EmptyState, PageHeader, Btn } from '../components/UI';

const INR = n => new Intl.NumberFormat('en-IN').format(n);
const ALL_COLS = ['name','department','salary','joinDate','status','performance','employeeId'];

export default function BuilderPage() {
  const [reportName, setReportName] = useState('Q4 Salary Analysis');
  const [cols,       setCols]       = useState(['name','department','salary','status']);
  const [groupBy,    setGroupBy]    = useState('department');
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [reports,    setReports]    = useState([]);
  const [employees,  setEmployees]  = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([apiGetReports(), apiGetEmployees(0, 50)])
      .then(([r, e]) => { 
        setReports(r.data.content || r.data || []); 
        setEmployees(e.data.content || e.data || []); 
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCol = col =>
    setCols(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);

  const handleSave = async () => {
    if (!reportName.trim()) { alert('Enter a report name'); return; }
    setSaving(true);
    try {
      const { data } = await apiSaveReport({ name: reportName, columns: cols.join(','), groupByField: groupBy });
      setReports(prev => [data, ...prev]);
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch { alert('Save failed — is the backend running?'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this report template?')) return;
    await apiDeleteReport(id);
    setReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Report Builder" subtitle="Create and save custom report templates to PostgreSQL" />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:24 }}>

        {/* ── Builder form ── */}
        <div className="glass-panel" style={{ overflow:'hidden' }}>
          {/* Report name */}
          <div style={{ padding:24, borderBottom:'1px solid var(--border-light)' }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Report Name</label>
            <input className="input-premium" value={reportName} onChange={e => setReportName(e.target.value)}
              style={{ width:'100%', padding:'12px 16px', fontSize:14 }} />
          </div>

          {/* Column picker */}
          <div style={{ padding:24, borderBottom:'1px solid var(--border-light)' }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Select Columns</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {ALL_COLS.map(col => (
                <button key={col} onClick={() => toggleCol(col)}
                  style={{ padding:'8px 16px', borderRadius:20, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all var(--transition-fast)', border: cols.includes(col) ? '1px solid transparent' : '1px solid var(--border-light)', background: cols.includes(col) ? 'var(--primary-accent)' : 'rgba(255,255,255,0.05)', color: cols.includes(col) ? '#fff' : 'var(--text-secondary)', boxShadow: cols.includes(col) ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none' }}>
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Group by */}
          <div style={{ padding:24, borderBottom:'1px solid var(--border-light)' }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Group By</label>
            <select className="input-premium" value={groupBy} onChange={e => setGroupBy(e.target.value)}
              style={{ padding:'12px 16px', fontSize:14, minWidth:200, appearance:'none' }}>
              {['department','status','performance'].map(g => <option key={g} style={{ background:'#1e293b' }}>{g}</option>)}
            </select>
          </div>

          {/* Live preview */}
          <div style={{ padding:24, borderBottom:'1px solid var(--border-light)' }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Live Preview (from DB)</label>
            {cols.length === 0 ? (
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>Select at least one column to preview.</p>
            ) : (
              <div style={{ overflowX:'auto', borderRadius:'var(--radius-md)', border:'1px solid var(--border-light)', background:'rgba(0,0,0,0.1)' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead style={{ background:'rgba(255,255,255,0.05)' }}>
                    <tr>
                      {cols.map(c => (
                        <th key={c} style={{ padding:'10px 14px', textAlign:'left', fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', fontSize:11, whiteSpace:'nowrap' }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0,4).map((e, i) => (
                      <tr key={e.id || i} style={{ borderTop:'1px solid var(--border-light)' }}>
                        {cols.map(c => (
                          <td key={c} style={{ padding:'10px 14px', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                            {c === 'salary'      ? <span style={{ color:'var(--text-primary)', fontWeight:500 }}>₹{INR(e[c])}</span> :
                             c === 'status' || c === 'performance' ? <Badge value={e[c]} /> :
                             <span style={{ color:'var(--text-primary)' }}>{String(e[c] ?? '')}</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Save button */}
          <div style={{ padding:24, display:'flex', justifyContent:'flex-end' }}>
            <Btn onClick={handleSave} disabled={saving || !reportName.trim()}
              icon={saved ? 'check' : 'plus'} variant={saved ? 'success' : 'primary'}>
              {saving ? <><Spinner size="sm" /> Saving…</> : saved ? 'Saved Successfully!' : 'Save Report Template'}
            </Btn>
          </div>
        </div>

        {/* ── Saved reports list ── */}
        <div className="glass-panel" style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'24px', borderBottom:'1px solid var(--border-light)' }}>
            <p style={{ fontWeight:700, fontSize:16, color:'var(--text-primary)', margin:0 }}>Saved Templates</p>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:4, margin:0 }}>{reports.length} templates in database</p>
          </div>
          <div style={{ overflowY:'auto', flex:1, maxHeight:600 }}>
            {loading ? (
              <div className="flex-center" style={{ padding:64 }}><Spinner /></div>
            ) : reports.length === 0 ? (
              <EmptyState icon="builder" message="No templates saved yet" />
            ) : reports.map(r => (
              <div key={r.id}
                style={{ padding:'20px 24px', borderBottom:'1px solid var(--border-light)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', transition:'background var(--transition-fast)' }}
                onMouseOver={ev => ev.currentTarget.style.background='rgba(59, 130, 246, 0.05)'} onMouseOut={ev => ev.currentTarget.style.background='transparent'}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', margin:0, marginBottom:6 }}>{r.name}</p>
                  <p style={{ fontSize:12, color:'var(--text-muted)', margin:0, marginBottom:10 }}>
                    By {r.createdBy} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {r.columns?.split(',').map(c => (
                      <span key={c} style={{ fontSize:11, background:'rgba(59, 130, 246, 0.15)', color:'#93c5fd', padding:'4px 10px', borderRadius:6, fontFamily:'monospace' }}>{c}</span>
                    ))}
                  </div>
                  {r.groupByField && (
                    <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:10, margin:0 }}>Group by: <strong style={{ color:'var(--text-primary)' }}>{r.groupByField}</strong></p>
                  )}
                </div>
                <button onClick={() => handleDelete(r.id)}
                  style={{ background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.2)', cursor:'pointer', color:'var(--accent-danger)', padding:8, borderRadius:'var(--radius-md)', transition:'all var(--transition-fast)', display:'flex', flexShrink:0, marginLeft:12 }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--accent-danger)'; e.currentTarget.style.color='#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color='var(--accent-danger)'; }}>
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
