import React, { useState, useEffect } from 'react';
import { uploadService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Database,
  Search,
  Plus
} from 'lucide-react';

const DataUpload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const data = await uploadService.getUploads();
      setUploads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch uploads', err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await uploadService.upload(file, user.username);
      if (response.status === 'success') {
        setSuccess(response.message);
        setFile(null);
        fetchUploads();
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload data. Please ensure the file format is correct (CSV/Excel).');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dataset?')) {
      try {
        await uploadService.delete(id);
        fetchUploads();
      } catch (err) {
        alert('Failed to delete upload');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Data Import & Analysis</h2>
        <p className="text-slate-500 mt-1">Upload business data in CSV or Excel format to generate custom reports and insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <div className="glass p-8 rounded-3xl lg:col-span-1">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <Upload size={20} className="text-accent" />
            <span>New Upload</span>
          </h3>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-accent transition-all cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
              />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
                  <Database size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">{file ? file.name : 'Select Data File'}</p>
                  <p className="text-xs text-slate-500 mt-1">Accepts CSV, Excel (max 10MB)</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center space-x-2 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-600 rounded-xl flex items-center space-x-2 text-sm">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!file || loading}
              className="btn-primary w-full py-3 font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Upload & Process</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Upload History */}
        <div className="glass p-8 rounded-3xl lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText size={20} className="text-accent" />
              <span>Import History</span>
            </div>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-slate-600">File Details</th>
                  <th className="pb-4 font-bold text-slate-600">Schema</th>
                  <th className="pb-4 font-bold text-slate-600">Records</th>
                  <th className="pb-4 font-bold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {uploads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-400">
                      No data has been uploaded yet.
                    </td>
                  </tr>
                ) : (
                  uploads.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-medium text-slate-900">
                        <div className="flex items-center space-x-3">
                          <FileText size={18} className="text-slate-400" />
                          <div>
                            <p>{u.filename}</p>
                            <p className="text-[10px] text-slate-400 uppercase">{u.contentType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 text-xs">
                        <div className="max-w-[200px] truncate" title={u.columns}>
                          {u.columns || 'Generic Data'}
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 text-sm font-bold">
                        {u.recordCount?.toLocaleString()}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleDelete(u.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
