import { useState, useEffect } from 'react';
import { apiGetEmployees } from '../services/api';
import { Icon, Badge, Spinner, Avatar, EmptyState, ErrorBanner, PageHeader, Btn } from '../components/UI';

const INR = n => new Intl.NumberFormat('en-IN').format(n);

export default function ReportsPage() {
  const [data,    setData]    = useState({ content: [], totalElements: 0, totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');
  const [dept,    setDept]    = useState('All');
  const [status,  setStatus]  = useState('All');
  const [done,    setDone]    = useState(false);
  const [page,    setPage]    = useState(0);

  useEffect(() => {
    setLoading(true);
    apiGetEmployees(page, 20)
      .then(r => setData({
        content: r.data.content || r.data || [],
        totalElements: r.data.totalElements || r.data.length || 0,
        totalPages: r.data.totalPages || 1,
        number: r.data.number || 0
      }))
      .catch(() => setError('Failed to load employees. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [page]);

  const depts = ['All', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance']; // Fallbacks

  // Client-side filtering ONLY for the current page (since backend Specifications are pending)
  const filtered = (data.content || []).filter(r => {
    const q = search.toLowerCase();
    return (
      (r.name?.toLowerCase().includes(q) || r.employeeId?.toLowerCase().includes(q)) &&
      (dept   === 'All' || r.department === dept) &&
      (status === 'All' || r.status === status)
    );
  });

  const exportCsv = () => {
    const header = 'ID,Name,Department,Salary,Join Date,Performance,Status\n';
    const body   = filtered.map(r =>
      `${r.employeeId},${r.name},${r.department},${r.salary},${r.joinDate},${r.performance},${r.status}`
    ).join('\n');
    const blob = new Blob([header + body], { type:'text/csv' });
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download:'employees.csv' }).click();
    setDone(true); setTimeout(() => setDone(false), 2500);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Enterprise Data Grid"
        subtitle={`${data.totalElements} total records in system · Page ${data.number + 1} of ${data.totalPages}`}
        action={
          <Btn onClick={exportCsv} icon={done ? 'check' : 'download'} variant={done ? 'success' : 'primary'}>
            {done ? 'Exported!' : 'Export Page CSV'}
          </Btn>
        }
      />

      {error && <ErrorBanner message={error} />}

      {/* Filters bar */}
      <div className="glass-panel" style={{ padding:16, marginBottom:20, display:'flex', flexWrap:'wrap', gap:12, alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:240, background:'rgba(15, 23, 42, 0.4)', border:'1px solid var(--border-light)', borderRadius:'var(--radius-md)', padding:'10px 14px', transition:'border var(--transition-fast)' }}>
          <Icon name="search" size={16} style={{ color:'var(--text-muted)', flexShrink:0 }} />
          <input className="input-premium" style={{ background:'transparent', border:'none', outline:'none', fontSize:14, padding:0, width:'100%' }}
            placeholder="Search by name or ID (current page)..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Icon name="filter" size={16} style={{ color:'var(--text-muted)' }} />
          <select value={dept} onChange={e => setDept(e.target.value)} className="input-premium" style={{ appearance:'none', paddingRight:32 }}>
            {depts.map(o => <option key={o} style={{ background:'#1e293b' }}>{o}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="input-premium" style={{ appearance:'none', paddingRight:32 }}>
            {['All','ACTIVE','INACTIVE'].map(o => <option key={o} style={{ background:'#1e293b' }}>{o}</option>)}
          </select>
        </div>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--primary-accent)', marginLeft:'auto', background:'rgba(59, 130, 246, 0.15)', padding:'4px 12px', borderRadius:20 }}>
          {filtered.length} visible
        </span>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow:'hidden' }}>
        {loading ? (
          <div className="flex-center" style={{ height:300 }}>
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                <thead>
                  <tr style={{ background:'rgba(0,0,0,0.2)', borderBottom:'1px solid var(--border-light)' }}>
                    {['Employee ID','Name','Department','Salary','Join Date','Performance','Status'].map((h, i) => (
                      <th key={h} style={{ padding:'16px 20px', textAlign: i === 3 ? 'right' : 'left', fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1, whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => (
                    <tr key={e.id || i} style={{ borderBottom:'1px solid var(--border-light)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', transition:'background var(--transition-fast)' }} onMouseOver={ev => ev.currentTarget.style.background='rgba(59, 130, 246, 0.05)'} onMouseOut={ev => ev.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}>
                      <td style={{ padding:'16px 20px', fontFamily:'monospace', fontSize:13, color:'var(--text-muted)' }}>{e.employeeId}</td>
                      <td style={{ padding:'16px 20px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <Avatar name={e.name} size={32} />
                          <span style={{ fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap' }}>{e.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:'16px 20px', color:'var(--text-secondary)', fontWeight:500 }}>{e.department}</td>
                      <td style={{ padding:'16px 20px', fontWeight:600, color:'var(--text-primary)', textAlign:'right' }}>₹{INR(e.salary)}</td>
                      <td style={{ padding:'16px 20px', color:'var(--text-muted)', whiteSpace:'nowrap', fontSize:13 }}>{e.joinDate}</td>
                      <td style={{ padding:'16px 20px' }}><Badge value={e.performance} /></td>
                      <td style={{ padding:'16px 20px' }}><Badge value={e.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border-light)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize:13, color:'var(--text-secondary)' }}>
                  Showing page <strong style={{ color:'var(--text-primary)' }}>{data.number + 1}</strong> of <strong style={{ color:'var(--text-primary)' }}>{data.totalPages}</strong>
                </span>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn variant="ghost" size="sm" disabled={data.number === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Previous</Btn>
                  <Btn variant="ghost" size="sm" disabled={data.number >= data.totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Btn>
                </div>
              </div>
            )}
            
            {filtered.length === 0 && <EmptyState icon="search" message="No records match your view" />}
          </>
        )}
      </div>
    </div>
  );
}
