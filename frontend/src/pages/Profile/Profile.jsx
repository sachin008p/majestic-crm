import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // ----- Edit profile state -----
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPwError('Password must be at least 6 characters');
      return;
    }

    setPwLoading(true);
    try {
      await api.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPwSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    try {
      const response = await api.put('/api/auth/profile', profileForm);
      // Update global user state with new name/email
      if (response && response.data) {
        setUser(prev => ({ ...prev, ...profileForm }));
      }
      setProfileSuccess('Profile updated');
      setEditing(false);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Profile</h1>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl font-semibold text-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      {/* Logout Confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Logout?</h3>
            <p className="text-slate-400 dark:text-slate-300 text-sm mb-6">Kya aap sure hain? Aapko dobara login karna padega.</p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 bg-rose-600 text-white py-2 rounded-xl font-semibold hover:bg-rose-500 transition-all"
              >
                Haan, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Info */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-indigo-500/20">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            {editing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2 rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    {profileLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
                {profileError && (
                  <div className="mt-2 text-sm text-red-600">{profileError}</div>
                )}
                {profileSuccess && (
                  <div className="mt-2 text-sm text-emerald-600">{profileSuccess}</div>
                )}
              </form>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name || 'Admin User'}</h2>
                <p className="text-slate-400 dark:text-slate-300 text-sm">{user?.email || '-'}</p>
                <span className="inline-block mt-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ADMIN
                </span>
                <button
                  onClick={() => setEditing(true)}
                  className="block mt-2 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-6 space-y-1">
          <div className="flex justify-between py-3 border-b border-slate-50 dark:border-slate-600">
            <span className="text-slate-500 font-medium text-sm dark:text-slate-400">Email</span>
            <span className="text-slate-800 dark:text-slate-100 text-sm">{user?.email || '-'}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-slate-500 font-medium text-sm dark:text-slate-400">Name</span>
            <span className="text-slate-800 dark:text-slate-100 text-sm">{user?.name || '-'}</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="glass rounded-2xl p-8">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Change Password</h2>

        {pwError && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {pwError}
          </div>
        )}
        {pwSuccess && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-600">
            {pwSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {pwLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}