import React, { useEffect, useState } from 'react';
import { auditService } from '../services/api';
import { 
  History, 
  Search, 
  Clock, 
  User, 
  Activity,
  Filter,
  Download
} from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await auditService.getLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Audit & Activity Logs</h2>
          <p className="text-slate-500 mt-1">Monitor system-wide activity and security events.</p>
        </div>
        <button className="btn-secondary px-6 py-3 flex items-center justify-center space-x-2 w-full md:w-auto">
          <Download size={20} />
          <span>Export Logs</span>
        </button>
      </div>

      <div className="glass p-8 rounded-3xl">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search logs by user, action, or details..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-2 text-slate-600 hover:bg-slate-100 transition-all">
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-slate-600">Timestamp</th>
                  <th className="pb-4 font-bold text-slate-600">User</th>
                  <th className="pb-4 font-bold text-slate-600">Action</th>
                  <th className="pb-4 font-bold text-slate-600">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <User size={14} className="text-slate-400" />
                        <span>{log.username}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-600' : 
                        log.action.includes('REPORT') ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-sm italic">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
