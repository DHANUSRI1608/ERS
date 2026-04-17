import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'EMPLOYEE'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await userService.update(user.id, { ...user, status: newStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
      } else {
        await userService.create(formData);
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ username: '', email: '', password: '', role: 'EMPLOYEE' });
      fetchUsers();
    } catch (err) {
      alert('Failed to save user');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' // Keep password empty for updates unless changed
    });
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h2>
          <p className="text-slate-500 mt-1">Manage platform access, roles, and user permissions.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ username: '', email: '', role: 'EMPLOYEE', password: '' });
            setIsModalOpen(true);
          }}
          className="btn-primary px-6 py-3 flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <UserPlus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="glass p-8 rounded-3xl">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search users by name, email or role..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  <th className="pb-4 font-bold text-slate-600">User</th>
                  <th className="pb-4 font-bold text-slate-600">Role</th>
                  <th className="pb-4 font-bold text-slate-600">Status</th>
                  <th className="pb-4 font-bold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.username}</p>
                          <p className="text-sm text-slate-500">{user.email || 'No email set'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 
                        user.role === 'ANALYST' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-5">
                      <button 
                        onClick={() => handleToggleStatus(user)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        <span>{user.status}</span>
                      </button>
                    </td>
                    <td className="py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 text-slate-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Username</label>
                <input 
                  type="text" 
                  required
                  disabled={!!editingUser}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-accent outline-none disabled:opacity-50"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Password {editingUser && '(Leave blank to keep current)'}</label>
                <input 
                  type="password" 
                  required={!editingUser}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Role</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <div className="pt-4 flex space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1 py-3 font-bold">Cancel</button>
                <button type="submit" className="btn-primary flex-1 py-3 font-bold">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
