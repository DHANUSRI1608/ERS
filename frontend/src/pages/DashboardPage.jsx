import { useState, useEffect } from 'react';
import { apiGetStats } from '../services/api';
import { KPICard, ChartCard, Spinner, ErrorBanner, PageHeader } from '../components/UI';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['var(--primary-accent)', '#8B5CF6', 'var(--accent-success)', 'var(--accent-warning)', 'var(--accent-danger)', '#6366F1'];
const INR = n => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', notation:'compact', maximumFractionDigits:1 }).format(n);

const REVENUE = [
  { month:'Jan', revenue:4200000, target:4000000, expenses:2800000 },
  { month:'Feb', revenue:3800000, target:4000000, expenses:2600000 },
  { month:'Mar', revenue:5100000, target:4500000, expenses:3100000 },
  { month:'Apr', revenue:4700000, target:4500000, expenses:2900000 },
  { month:'May', revenue:5300000, target:5000000, expenses:3200000 },
  { month:'Jun', revenue:6100000, target:5000000, expenses:3600000 },
  { month:'Jul', revenue:5800000, target:5500000, expenses:3400000 },
  { month:'Aug', revenue:6400000, target:5500000, expenses:3700000 },
  { month:'Sep', revenue:7200000, target:6000000, expenses:4100000 },
  { month:'Oct', revenue:6900000, target:6500000, expenses:3900000 },
  { month:'Nov', revenue:7800000, target:7000000, expenses:4300000 },
  { month:'Dec', revenue:8500000, target:7500000, expenses:4700000 },
];

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    apiGetStats()
      .then(r => setStats(r.data))
      .catch(() => setError('Could not load stats — make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex-center" style={{ height:400 }}>
      <Spinner size="lg" />
    </div>
  );
  if (error) return <ErrorBanner message={error} />;

  const depts   = stats.departments || [];
  const total   = Number(stats.totalEmployees) || 0;
  const pieData = depts.map(d => ({
    name:  d.department,
    value: total > 0 ? Math.round((Number(d.headcount) / total) * 100) : 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(15,23,42,0.9)', border: '1px solid var(--border-light)' }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
              <span style={{ color: '#cbd5e1', fontSize: 13 }}>{entry.name}:</span>
              <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: 13 }}>
                {entry.name.includes('Salary') || entry.name.includes('Revenue') || entry.name.includes('Expenses') || entry.name.includes('Target') 
                  ? INR(entry.value) 
                  : entry.value + (entry.dataKey === 'value' ? '%' : '')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <PageHeader 
        title="Analytics Dashboard" 
        subtitle={`Live data from PostgreSQL · ${new Date().toLocaleString()}`} 
      />

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:24, marginBottom:32 }}>
        <KPICard title="Total Employees"     value={total}                     change="+5.6" icon="users"    color="violet"  subtitle={`${stats.activeEmployees} active`} />
        <KPICard title="Active Employees"    value={stats.activeEmployees}     change="+3.2" icon="check"    color="emerald" subtitle="Currently employed" />
        <KPICard title="Avg Monthly Salary"  value={INR(stats.avgSalary||0)}   change="+8.2" icon="chart"    color="blue"    subtitle="Per active employee" />
        <KPICard title="Departments"         value={depts.length}                            icon="dashboard" color="amber"  subtitle="Active business units" />
      </div>

      {/* Revenue chart + Pie */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24, marginBottom:24 }}>
        <ChartCard title="Revenue vs Target vs Expenses" subtitle="Monthly · FY 2025–26">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={REVENUE} margin={{ top:20, right:10, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--primary-accent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10}/>
              <YAxis tick={{ fontSize:12, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10} tickFormatter={v => `₹${v/1e5}L`}/>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:12, paddingTop:16, color:'var(--text-secondary)' }} iconType="circle"/>
              <Area type="monotone" dataKey="revenue"  stroke="var(--primary-accent)" fill="url(#gRev)" strokeWidth={3} name="Revenue"  activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary-accent)' }} />
              <Area type="monotone" dataKey="target"   stroke="#8B5CF6" fill="none" strokeWidth={2} strokeDasharray="4 4" name="Target" dot={false} activeDot={{ r: 4 }}/>
              <Area type="monotone" dataKey="expenses" stroke="var(--accent-danger)" fill="none" strokeWidth={2} name="Expenses" dot={false} activeDot={{ r: 4 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Headcount Distribution" subtitle="By department %">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:12, color:'var(--text-secondary)' }} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bar charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        <ChartCard title="Headcount by Department" subtitle="From live database">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={depts} margin={{ top:20, right:10, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="department" tick={{ fontSize:12, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10}/>
              <YAxis tick={{ fontSize:12, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10}/>
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="headcount" name="Employees" radius={[4,4,0,0]} barSize={32}>
                {depts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg Salary by Department" subtitle="In Indian Rupees">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={depts} layout="vertical" margin={{ top:10, right:20, left:20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
              <XAxis type="number" tick={{ fontSize:12, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => INR(v)}/>
              <YAxis dataKey="department" type="category" tick={{ fontSize:12, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} dx={-10}/>
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgSalary" name="Avg Salary" radius={[0,4,4,0]} fill="#8B5CF6" barSize={16}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
