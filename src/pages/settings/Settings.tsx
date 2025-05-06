import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/constants';
import axios from 'axios';

const Settings = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // Simulate saving profile (replace with real API call)
      await axios.put(`${API_URL}/user/profile`, {
        name: form.name,
        email: form.email,
      });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!form.currentPassword || !form.newPassword) {
      setError('Both password fields are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // Simulate password change (replace with real API call)
      await axios.post(`${API_URL}/user/change-password`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Password changed successfully.');
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setError('Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action is permanent.');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/user`);
      navigate('/login');
    } catch (err) {
      alert('Failed to delete account.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="input"
        />
        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="input"
        />
        <button onClick={handleSave} disabled={submitting} className="btn btn-primary">
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
        <input
          name="currentPassword"
          type="password"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          className="input"
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="input"
        />
        <button onClick={handleChangePassword} disabled={submitting} className="btn btn-primary">
          {submitting ? 'Updating...' : 'Change Password'}
        </button>
      </div>

      {/* Theme Toggle Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Theme settings coming soon...</p>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-error-600 dark:text-error-400">Danger Zone</h2>
        <button onClick={handleDeleteAccount} className="btn btn-outline border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
