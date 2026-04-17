import { useState, useRef } from 'react';
import { apiUpload } from '../services/api';
import { Icon, Badge, Spinner, PageHeader } from '../components/UI';

const INR = n => new Intl.NumberFormat('en-IN').format(n);

export default function UploadPage() {
  const [stage,    setStage]    = useState('idle');
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [errors,   setErrors]   = useState([]);
  const [result,   setResult]   = useState(null);
  const [drag,     setDrag]     = useState(false);
  const fileRef = useRef();

  const handleFile = async file => {
    setFileName(file.name); setStage('uploading'); setProgress(0);
    try {
      const { data } = await apiUpload(file, setProgress);
      if (data.success) { setResult(data); setStage('success'); }
      else              { setErrors(data.errors || []); setStage('error'); }
    } catch (err) {
      setErrors([{ row:'-', field:'file', issue: err.response?.data?.error || 'Upload failed — is the backend running?' }]);
      setStage('error');
    }
  };

  const reset = () => { setStage('idle'); setErrors([]); setResult(null); setProgress(0); };

  return (
    <div className="animate-fade-in" style={{ maxWidth:760 }}>
      <PageHeader title="Data Upload" subtitle="Import Excel (.xlsx) or CSV — records saved directly to PostgreSQL" />

      {/* Format hint */}
      <div style={{ background:'rgba(59, 130, 246, 0.1)', border:'1px solid rgba(59, 130, 246, 0.2)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:24 }}>
        <p style={{ fontWeight:700, color:'var(--primary-accent)', fontSize:14, marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
          <Icon name="info" size={16} /> Required columns (in this order):
        </p>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:10 }}>
          {['employee_id','name','department','salary','date'].map(c => (
            <code key={c} style={{ background:'rgba(59, 130, 246, 0.15)', color:'#93c5fd', padding:'4px 10px', borderRadius:6, fontSize:13, fontFamily:'monospace' }}>{c}</code>
          ))}
        </div>
        <p style={{ fontSize:13, color:'var(--text-muted)' }}>
          ✓ Valid departments: Sales, Engineering, Marketing, Finance, HR, Operations
        </p>
      </div>

      {/* Idle — drop zone */}
      {stage === 'idle' && (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          style={{ border:`2px dashed ${drag ? 'var(--primary-accent)' : 'var(--border-light)'}`, borderRadius:'var(--radius-lg)', padding:64, display:'flex', flexDirection:'column', alignItems:'center', gap:20, cursor:'pointer', background: drag ? 'rgba(59, 130, 246, 0.05)' : 'rgba(15, 23, 42, 0.4)', transition:'all var(--transition-fast)', boxShadow: drag ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none' }}>
          <div style={{ width:72, height:72, borderRadius:20, background: drag ? 'var(--primary-accent)' : 'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all var(--transition-fast)' }}>
            <Icon name="upload" size={32} style={{ color: drag ? '#fff' : 'var(--text-muted)' }} />
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontWeight:600, color:'var(--text-primary)', marginBottom:8, fontSize:16 }}>
              Drop file here or <span style={{ color:'var(--primary-accent)' }}>browse</span>
            </p>
            <p style={{ fontSize:14, color:'var(--text-muted)' }}>.xlsx and .csv · Max 50 MB</p>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.csv" style={{ display:'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {/* Uploading */}
      {stage === 'uploading' && (
        <div className="glass-panel" style={{ padding:64, display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
          <Spinner size="lg" />
          <p style={{ fontWeight:600, color:'var(--text-primary)', fontSize:16 }}>Processing <span style={{ color:'var(--primary-accent)' }}>{fileName}</span>…</p>
          <div style={{ width:320, background:'rgba(255,255,255,0.05)', borderRadius:99, height:8, overflow:'hidden' }}>
            <div style={{ background:'var(--primary-accent)', height:8, borderRadius:99, width:`${progress}%`, transition:'width 0.3s ease-out' }} />
          </div>
          <p style={{ fontSize:14, color:'var(--text-muted)' }}>{progress}% · Validating and importing…</p>
        </div>
      )}

      {/* Errors */}
      {stage === 'error' && (
        <div className="animate-fade-in">
          <div style={{ background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.2)', borderRadius:'var(--radius-lg)', padding:24, marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'var(--accent-danger)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name="x" size={24} style={{ color:'#fff' }} />
              </div>
              <div>
                <p style={{ fontWeight:700, color:'#fca5a5', fontSize:16, margin:0, marginBottom:4 }}>Validation Failed</p>
                <p style={{ fontSize:14, color:'var(--accent-danger)', margin:0 }}>{errors.length} error(s) in <code>{fileName}</code></p>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {errors.map((e, i) => (
                <div key={i} style={{ display:'flex', gap:16, background:'rgba(15, 23, 42, 0.6)', borderRadius:'var(--radius-md)', padding:'14px 20px', fontSize:14, alignItems:'flex-start', border:'1px solid rgba(239, 68, 68, 0.1)' }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#fff', background:'var(--accent-danger)', padding:'4px 10px', borderRadius:6, whiteSpace:'nowrap', flexShrink:0 }}>Row {e.row}</span>
                  <code style={{ color:'#93c5fd', fontSize:13, marginTop:2, flexShrink:0 }}>{e.field}</code>
                  <span style={{ color:'var(--text-secondary)' }}>{e.issue}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={reset} className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
            <Icon name="upload" size={16} /> Try Again
          </button>
        </div>
      )}

      {/* Success */}
      {stage === 'success' && result && (
        <div className="animate-fade-in">
          <div style={{ background:'rgba(16, 185, 129, 0.1)', border:'1px solid rgba(16, 185, 129, 0.2)', borderRadius:'var(--radius-lg)', padding:24, marginBottom:24, display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'var(--accent-success)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon name="check" size={24} style={{ color:'#fff' }} />
            </div>
            <div>
              <p style={{ fontWeight:700, color:'#6ee7b7', fontSize:16, margin:0, marginBottom:4 }}>Import Successful!</p>
              <p style={{ fontSize:14, color:'var(--accent-success)', margin:0 }}>{result.imported} records saved to PostgreSQL</p>
            </div>
          </div>

          {result.preview?.length > 0 && (
            <div className="glass-panel" style={{ overflow:'hidden', marginBottom:24 }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-light)' }}>
                <p style={{ fontWeight:600, fontSize:14, color:'var(--text-primary)', margin:0 }}>Preview — first 5 imported rows</p>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead style={{ background:'rgba(0,0,0,0.2)' }}>
                    <tr>
                      {['ID','Name','Department','Salary','Status'].map(h => (
                        <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', fontSize:11, letterSpacing:1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.preview.map((r, i) => (
                      <tr key={r.employeeId || i} style={{ borderTop:'1px solid var(--border-light)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding:'12px 20px', fontFamily:'monospace', color:'var(--text-muted)' }}>{r.employeeId}</td>
                        <td style={{ padding:'12px 20px', fontWeight:600, color:'var(--text-primary)' }}>{r.name}</td>
                        <td style={{ padding:'12px 20px', color:'var(--text-secondary)' }}>{r.department}</td>
                        <td style={{ padding:'12px 20px', color:'var(--text-primary)' }}>₹{INR(r.salary)}</td>
                        <td style={{ padding:'12px 20px' }}><Badge value={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button onClick={reset} className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
            <Icon name="upload" size={16} /> Upload Another File
          </button>
        </div>
      )}
    </div>
  );
}
