import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileDown, FileText, History, Download, Loader2 } from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await reportService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleDownload = async (type) => {
    setLoading(true);
    try {
      const blob = type === 'pdf' 
        ? await reportService.getWeeklyPdf(user.username)
        : await reportService.getWeeklyExcel(user.username);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weekly_report.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      fetchHistory();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-700">
      <div className="glass p-8 rounded-3xl">
        <h2 className="text-2xl font-bold flex items-center space-x-3 mb-6">
          <FileText className="text-accent" />
          <span>Generate Weekly Reports</span>
        </h2>
        <p className="text-slate-500 mb-8">Select the format below to generate and download the latest enterprise metrics.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleDownload('pdf')}
            disabled={loading}
            className="flex items-center justify-center space-x-3 p-6 border-2 border-slate-100 rounded-2xl hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <div className="p-3 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
              {loading ? <Loader2 className="animate-spin" /> : <FileDown size={24} />}
            </div>
            <div className="text-left">
              <p className="font-bold">PDF Format</p>
              <p className="text-xs text-slate-400">High-quality document</p>
            </div>
          </button>

          <button
            onClick={() => handleDownload('xlsx')}
            disabled={loading}
            className="flex items-center justify-center space-x-3 p-6 border-2 border-slate-100 rounded-2xl hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
              {loading ? <Loader2 className="animate-spin" /> : <Download size={24} />}
            </div>
            <div className="text-left">
              <p className="font-bold">Excel Format</p>
              <p className="text-xs text-slate-400">Data analysis ready</p>
            </div>
          </button>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl">
        <h2 className="text-xl font-bold flex items-center space-x-3 mb-6">
          <History className="text-accent" />
          <span>Report History</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-bold text-slate-500">Report Name</th>
                <th className="pb-4 font-bold text-slate-500">Format</th>
                <th className="pb-4 font-bold text-slate-500">Created By</th>
                <th className="pb-4 font-bold text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 font-medium">{report.name}</td>
                  <td className="py-4 capitalize">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${report.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4">{report.createdBy?.username}</td>
                  <td className="py-4 text-slate-500">{new Date(report.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
            <div className="text-center py-12 text-slate-400">No reports generated yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
