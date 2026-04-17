import { useState, useEffect, useCallback } from 'react';
import { apiGetUsers, apiCreateUser, apiUpdateRole, apiDeleteUser, apiGetLogs } from '../services/api';
import { Icon, Badge, Avatar, Spinner, EmptyState, PageHeader, Btn, Modal, Input, Select } from '../components/UI';

const TABS = ['Users', 'Audit Logs'];

export default function AdminPage() {
  const [tab,      setTab]      = useState('Users');
  const [users,    setUsers]    = useState([]);
  
  // Audit logs pagination state
  const [logsData, setLogsData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 });
  const [logPage,  setLogPage]  = useState(0);

  const [loading,  setLoading]  = useState(true);
  const [showModal,setShowModal]= useState(false);

  // Create user form
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'EMPLOYEE', department:'' });

  const load = useCallback(() => {
    setLoading(true);
    if (tab === 'Users') {
      apiGetUsers()
        .then(r => setUsers(r.data))
        .finally(() => setLoading(false));
    } else {
      apiGetLogs(logPage, 20)
        .then(r => setLogsData({
          content: r.data.content || [],
          totalPages: r.data.totalPages || 0,
          number: r.data.number || 0,
          totalElements: r.data.totalElements || 0
        }))
        .finally(() => setLoading(false));
    }
  }, [tab, logPage]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) { alert('Fill all required fields'); return; }
    try {
      const { data } = await apiCreateUser(form);
      setUsers(prev => [data, ...prev]);
      setShowModal(false);
      setForm({ name:'', email:'', password:'', role:'EMPLOYEE', department:'' });
    } catch (e) { alert(e.response?.data?.message || 'Failed to create user'); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const { data } = await apiUpdateRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? data : u));
    } catch { alert('Failed to update role'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await apiDeleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { alert('Failed to delete user'); }
  };

  const handleDownloadLogs = () => {
    // We can directly open the backend endpoint since GET works, 
    // but we need to pass Auth header. Easiest is to fetch and create object URL.
    const token = localStorage.getItem('ers_token');
    fetch((process.env.REACT_APP_API_URL || '/api') + '/admin/logs/download', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit_logs.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(() => alert('Failed to download logs'));
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Admin Panel"
        subtitle="Manage secure access and system compliance"
        action={
          <div style={{ display:'flex', gap:12 }}>
            {tab === 'Audit Logs' && (
              <Btn icon="download" variant="ghost" onClick={handleDownloadLogs}>Export Log Data</Btn>
            )}
            {tab === 'Users' && (
              <Btn icon="plus" onClick={() => setShowModal(true)}>New User account</Btn>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:24, background:'rgba(15, 23, 42, 0.4)', border:'1px solid var(--border-light)', borderRadius:'var(--radius-lg)', padding:6, width:'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setLogPage(0); }}
            style={{ padding:'10px 24px', borderRadius:'var(--radius-md)', border:'none', fontWeight:600, fontSize:14, cursor:'pointer', transition:'all var(--transition-fast)', background: tab === t ? 'var(--primary-accent)' : 'transparent', color: tab === t ? '#fff' : 'var(--text-secondary)', boxShadow: tab === t ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {tab === 'Users' && (
        <div className="glass-panel" style={{ overflow:'hidden' }}>
          {loading ? (
            <div className="flex-center" style={{ padding:64 }}><Spinner size="lg" /></div>
          ) : users.length === 0 ? (
            <EmptyState icon="users" message="No user accounts registered" />
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                <thead>
                  <tr style={{ background:'rgba(0,0,0,0.2)', borderBottom:'1px solid var(--border-light)' }}>
                    {['User Details','Email Address','System Role','Department','Status','Joined Date','Actions'].map(h => (
                      <th key={h} style={{ padding:'16px 20px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1, whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom:'1px solid var(--border-light)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', transition:'background var(--transition-fast)' }} onMouseOver={ev => ev.currentTarget.style.background='rgba(59, 130, 246, 0.05)'} onMouseOut={ev => ev.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}>
                      <td style={{ padding:'16px 20px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <Avatar name={u.name} size={36} />
                          <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:'16px 20px', color:'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding:'16px 20px' }}>
                        <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                                className="input-premium" style={{ appearance:'none', padding:'6px 12px', fontSize:13 }}>
                          {['ADMIN','ANALYST','EMPLOYEE'].map(r => <option key={r} style={{ background:'#1e293b' }}>{r}</option>)}
                        </select>
                      </td>
                      <td style={{ padding:'16px 20px', color:'var(--text-secondary)' }}>{u.department || '—'}</td>
                      <td style={{ padding:'16px 20px' }}><Badge value={u.status} /></td>
                      <td style={{ padding:'16px 20px', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                        {u.joinedDate ? new Date(u.joinedDate).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding:'16px 20px' }}>
                        <button onClick={() => handleDelete(u.id)}
                          style={{ background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.2)', cursor:'pointer', color:'var(--accent-danger)', padding:8, borderRadius:'var(--radius-md)', transition:'all var(--transition-fast)', display:'flex' }}
                          onMouseEnter={e => { e.currentTarget.style.background='var(--accent-danger)'; e.currentTarget.style.color='#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color='var(--accent-danger)'; }}>
                          <Icon name="trash" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Audit Logs tab */}
      {tab === 'Audit Logs' && (
        <div className="glass-panel" style={{ overflow:'hidden' }}>
          {loading ? (
            <div className="flex-center" style={{ padding:64 }}><Spinner size="lg" /></div>
          ) : logsData.content.length === 0 ? (
            <EmptyState icon="reports" message="No audit logs generated yet" />
          ) : (
            <>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                  <thead>
                    <tr style={{ background:'rgba(0,0,0,0.2)', borderBottom:'1px solid var(--border-light)' }}>
                      {['User Identity','Action Type','System Module','Status','IP Address','Timestamp'].map(h => (
                        <th key={h} style={{ padding:'16px 20px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1, whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logsData.content.map((l, i) => (
                      <tr key={l.id} style={{ borderBottom:'1px solid var(--border-light)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', transition:'background var(--transition-fast)' }} onMouseOver={ev => ev.currentTarget.style.background='rgba(59, 130, 246, 0.05)'} onMouseOut={ev => ev.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}>
                        <td style={{ padding:'16px 20px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                            <Avatar name={l.userName || '?'} size={32} />
                            <div>
                              <p style={{ fontWeight:600, color:'var(--text-primary)', margin:0, marginBottom:4, fontSize:14 }}>{l.userName}</p>
                              <p style={{ color:'var(--text-muted)', margin:0, fontSize:12 }}>{l.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:'16px 20px', color:'var(--text-primary)', fontWeight:500 }}>{l.action}</td>
                        <td style={{ padding:'16px 20px' }}>
                          <span style={{ background:'rgba(255,255,255,0.05)', color:'var(--text-secondary)', border:'1px solid var(--border-light)', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600 }}>{l.module}</span>
                        </td>
                        <td style={{ padding:'16px 20px' }}><Badge value={l.status} /></td>
                        <td style={{ padding:'16px 20px', fontFamily:'monospace', fontSize:13, color:'var(--text-muted)' }}>{l.ipAddress || '—'}</td>
                        <td style={{ padding:'16px 20px', color:'var(--text-secondary)', fontSize:13, whiteSpace:'nowrap' }}>
                          {l.timestamp ? new Date(l.timestamp).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {logsData.totalPages > 1 && (
                <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border-light)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,0.1)' }}>
                  <span style={{ fontSize:13, color:'var(--text-secondary)' }}>
                    Showing page <strong style={{ color:'var(--text-primary)' }}>{logsData.number + 1}</strong> of <strong style={{ color:'var(--text-primary)' }}>{logsData.totalPages}</strong> ({logsData.totalElements} records)
                  </span>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn variant="ghost" size="sm" disabled={logsData.number === 0} onClick={() => setLogPage(p => Math.max(0, p - 1))}>Prev</Btn>
                    <Btn variant="ghost" size="sm" disabled={logsData.number >= logsData.totalPages - 1} onClick={() => setLogPage(p => p + 1)}>Next</Btn>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create User Modal */}
      {showModal && (
        <Modal title="Setup New Account" onClose={() => setShowModal(false)}>
          <Input label="Full Name *"   value={form.name}       onChange={e => setForm(f => ({...f, name:e.target.value}))}       placeholder="e.g. Maya Chen" />
          <Input label="Work Email *"  value={form.email}      onChange={e => setForm(f => ({...f, email:e.target.value}))}      type="email" placeholder="maya.chen@enterprise.com" />
          <Input label="Password *"    value={form.password}   onChange={e => setForm(f => ({...f, password:e.target.value}))}   type="password" placeholder="Use a strong password" />
          <Select label="Security Role" value={form.role} onChange={e => setForm(f => ({...f, role:e.target.value}))}
            options={['ADMIN','ANALYST','EMPLOYEE'].map(r => ({ value:r, label:r }))} />
          <Input label="Department"    value={form.department} onChange={e => setForm(f => ({...f, department:e.target.value}))} placeholder="e.g. Operations" />
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleCreate} icon="plus">Provision User</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
