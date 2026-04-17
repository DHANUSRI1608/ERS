import React, { useEffect, useState } from 'react';
import Card from '../components/DashboardCards';
import { Bar, Pie } from 'react-chartjs-2';
import { analyticsService } from '../services/api';
import { DollarSign, TrendingUp, Users, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    analyticsService.getWeeklyMetrics().then(setMetrics).catch(console.error);
  }, []);

  const chartData = {
    labels: (metrics || []).map(m => m.department),
    datasets: [
      {
        label: 'Revenue ($)',
        data: (metrics || []).map(m => m.revenue),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 8,
      }
    ]
  };

  const pieData = {
    labels: (metrics || []).map(m => m.department),
    datasets: [
      {
        data: (metrics || []).map(m => m.performance),
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
        ],
      }
    ]
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Revenue" 
          value={`$${(metrics || []).reduce((acc, m) => acc + (m.revenue || 0), 0).toLocaleString()}`} 
          change="+12.5%" 
          icon={<DollarSign size={24} />} 
          trend="up" 
        />
        <Card title="Growth Rate" value="8.4%" change="+2.1%" icon={<TrendingUp size={24} />} trend="up" />
        <Card title="Departments" value={(metrics || []).length.toString()} change="Stable" icon={<Users size={24} />} trend="up" />
        <Card 
          title="Avg Performance" 
          value={`${Math.round((metrics || []).reduce((acc, m) => acc + (m.performance || 0), 0) / (metrics || []).length || 0)}%`} 
          change="-1.2%" 
          icon={<Activity size={24} />} 
          trend="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-6">Revenue by Department</h3>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-6">Performance Distribution</h3>
          <div className="max-w-[300px] mx-auto">
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
