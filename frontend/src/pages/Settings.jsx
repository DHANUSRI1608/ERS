import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Save,
  Lock,
  Mail,
  FileType,
  Clock
} from 'lucide-react';

const Settings = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    reportFormat: 'PDF',
    generationSchedule: 'Weekly',
    emailNotifications: true,
    systemLogs: true
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (profileData.password !== profileData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile(profileData);
      login({ ...user, ...updatedUser });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700 text-slate-900">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">System Settings</h2>
        <p className="text-slate-500 mt-1">Configure your personal preferences and system-wide policies.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'profile' ? 'bg-accent text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
          >
            <User size={20} />
            <span>Profile settings</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'system' ? 'bg-accent text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
          >
            <SettingsIcon size={20} />
            <span>System Config</span>
          </button>

        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="glass p-8 rounded-3xl">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-2xl">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{user?.username}</h3>
                    <p className="text-sm text-slate-500">{user?.role} Account</p>
                  </div>
                </div>

                {success && (
                  <div className="p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 flex items-center space-x-2 animate-in fade-in">
                    <Save size={18} />
                    <span>{success}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl opacity-60"
                        value={profileData.username}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        placeholder="Leave blank to keep current"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                        value={profileData.password}
                        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">Confirm Password</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-8 py-3 font-bold flex items-center space-x-2"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save size={20} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'system' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">General System Configuration</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><FileType size={20} /></div>
                        <div>
                          <p className="font-bold">Default Report Format</p>
                          <p className="text-xs text-slate-500">Global export format for all generated reports.</p>
                        </div>
                      </div>
                      <select
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none"
                        value={systemSettings.reportFormat}
                        onChange={(e) => setSystemSettings({ ...systemSettings, reportFormat: e.target.value })}
                      >
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Clock size={20} /></div>
                        <div>
                          <p className="font-bold">Generation Schedule</p>
                          <p className="text-xs text-slate-500">Automatic reporting frequency.</p>
                        </div>
                      </div>
                      <select
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none"
                        value={systemSettings.generationSchedule}
                        onChange={(e) => setSystemSettings({ ...systemSettings, generationSchedule: e.target.value })}
                      >
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Bell size={20} /></div>
                        <div>
                          <p className="font-bold">Email Notifications</p>
                          <p className="text-xs text-slate-500">Send alerts when reports are ready.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSystemSettings({ ...systemSettings, emailNotifications: !systemSettings.emailNotifications })}
                        className={`w-12 h-6 rounded-full p-1 transition-all ${systemSettings.emailNotifications ? 'bg-accent' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${systemSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button className="btn-primary px-8 py-3 font-bold">Apply System Changes</button>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
