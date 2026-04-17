import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/api';
import Card from '../components/DashboardCards';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [deptMetrics, setDeptMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sum, trend, metrics] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getRevenueTrend(),
          analyticsService.getWeeklyMetrics()
        ]);
        setSummary(sum);
        setRevenueTrend(trend);
        setDeptMetrics(metrics);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const revenueChartData = {
    labels: (revenueTrend || []).map(t => t.date),
    datasets: [
      {
        label: 'Revenue Growth',
        data: (revenueTrend || []).map(t => t.revenue),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
      }
    ]
  };

  const performanceChartData = {
    labels: (deptMetrics || []).map(m => m.department),
    datasets: [
      {
        label: 'Performance Score',
        data: (deptMetrics || []).map(m => m.performance),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderRadius: 8,
      }
    ]
  };

  const distributionData = {
    labels: (deptMetrics || []).map(m => m.department),
    datasets: [
      {
        data: (deptMetrics || []).map(m => m.revenue),
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
        ],
      }
    ]
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analytics Overview</h2>
          <p className="text-slate-500 mt-1">Detailed performance metrics and revenue trends across departments.</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary px-4 py-2 flex items-center space-x-2">
            <Activity size={18} />
            <span>Live Feed</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Revenue" 
          value={`$${(summary?.totalRevenue || 0).toLocaleString()}`} 
          change="+12.5%" 
          icon={<DollarSign size={24} />} 
          trend="up" 
        />
        <Card 
          title="Reports Generated" 
          value={(summary?.reportsGenerated || 0).toString()} 
          change="+8.2%" 
          icon={<FileText size={24} />} 
          trend="up" 
        />
        <Card 
          title="Active Users" 
          value={(summary?.activeUsers || 0).toString()} 
          change="+5.4%" 
          icon={<Users size={24} />} 
          trend="up" 
        />
        <Card 
          title="Weekly Growth" 
          value={`${summary?.weeklyGrowth || 0}%`} 
          change="+2.1%" 
          icon={<TrendingUp size={24} />} 
          trend="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Weekly Revenue Trends ($)</h3>
          <Line 
            data={revenueChartData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { position: 'top' },
              },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Revenue in USD' } },
                x: { title: { display: true, text: 'Fiscal Week' } }
              }
            }} 
          />
        </div>
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Department Performance Index</h3>
          <Bar 
            data={performanceChartData} 
            options={{ 
              responsive: true, 
              plugins: { 
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `Performance: ${context.raw}%` } }
              },
              scales: {
                y: { max: 100, title: { display: true, text: 'Success Rate (%)' } }
              }
            }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-3xl lg:col-span-1">
          <h3 className="text-lg font-bold mb-6">Revenue Distribution</h3>
          <div className="max-w-[250px] mx-auto">
            <Pie data={distributionData} />
          </div>
        </div>
        <div className="glass p-8 rounded-3xl lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Department Metrics Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-slate-600">Department</th>
                    <th className="pb-4 font-bold text-slate-600">Revenue</th>
                    <th className="pb-4 font-bold text-slate-600">Growth</th>
                    <th className="pb-4 font-bold text-slate-600">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(deptMetrics || []).map((dept, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-bold text-slate-900">{dept.department}</td>
                      <td className="py-4 text-slate-500">${Math.round(dept.revenue || 0).toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`flex items-center space-x-1 font-bold ${(dept.growth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {(dept.growth || 0) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span>{(dept.growth || 0).toFixed(1)}%</span>
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-accent h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${dept.performance || 0}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
