// src/components/Settings.jsx

import { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiViewGrid, HiOutlinePlusCircle, HiOutlineChartBar, HiOutlineCog, HiOutlineLogout, HiOutlineUserCircle, HiOutlineLockClosed, HiOutlineExclamationCircle
} from 'react-icons/hi';

export default function Settings({ setHabits, currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [greeting, setGreeting] = useState('Welcome back,'); // <-- 2. New state for greeting

  // 3. This effect checks for the "new user" flag ONCE
  useEffect(() => {
    const isNewUser = sessionStorage.getItem('isNewUser');
    if (isNewUser) {
      setGreeting('Welcome,');
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/me/profile', profileData);
      setCurrentUser(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Could not update profile.');
    }
  };

   const handlePasswordChange = (e) => {
      setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
   };

   const handleChangePassword = async (e) => {
      e.preventDefault();
      if (passwordData.newPassword.length < 6) {
          toast.error('New password must be at least 6 characters long.');
          return;
      }
      try {
          const res = await api.put('/users/me/password', passwordData);
          toast.success(res.data.msg);
          setPasswordData({ currentPassword: '', newPassword: ''});
      } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.msg || 'Could not change password.');
      }
   };

  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
  const date = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const handleLogout = () => {
    localStorage.removeItem('babyStepsToken');
    window.location.href = '/login';
  };

  const handleResetHabits = async () => {
     if (window.confirm("Are you sure you want to delete all your habits? This cannot be undone.")) {
       try {
         await api.delete('/habits/reset');
         setHabits([]);
         toast.success('All habits have been reset.');
       } catch (err) { console.error(err); toast.error('Could not reset habits'); }
     }
   };

  const handleDeleteAccount = async () => {
    if (window.confirm("ARE YOU ABSOLUTELY SURE? This will permanently delete your account and all habits. This action cannot be undone.")) {
      try {
        await api.delete('/users/me');
        toast.success('Account deleted successfully.');
        localStorage.removeItem('babyStepsToken');
        window.location.href = '/';
      } catch (err) { console.error(err); toast.error('Could not delete account.'); }
    }
  };

  const displayName = profileData.firstName || profileData.lastName ? `${profileData.firstName} ${profileData.lastName}` : (currentUser ? currentUser.username : 'User');
  const username = currentUser ? currentUser.username : 'username@email.com';
  const welcomeName = profileData.firstName ? profileData.firstName : (currentUser ? currentUser.firstName : 'User');

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-[#7A8744] text-white flex flex-col">
           <div className="flex flex-col items-center p-6 border-b border-white/20">
              <img src="/user-avatar.png" alt="User Avatar" className="w-20 h-20 rounded-full mb-3 border-2 border-white" />
              <h3 className="font-semibold text-lg">{displayName}</h3>
              <p className="text-sm text-gray-200">{username}</p>
            </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiViewGrid className="w-6 h-6" /><span>Dashboard</span></Link>
            <Link to="/add-habits" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiOutlinePlusCircle className="w-6 h-6" /><span>Add Habits</span></Link>
            <Link to="/progress" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiOutlineChartBar className="w-6 h-6" /><span>Progress</span></Link>
            <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg bg-white text-[#7A8744] font-semibold"><HiOutlineCog className="w-6 h-6" /><span>Settings</span></Link>
          </nav>
          <div className="p-4 border-t border-white/20">
            <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-white/20 transition-colors"><HiOutlineLogout className="w-6 h-6" /><span>Logout</span></button>
          </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex justify-between items-center p-6 bg-white border-b">
           <h1 className="text-xl text-gray-400">Settings</h1>
          <div className="text-right">
            <p className="font-semibold text-gray-700">{weekday}</p>
            <p className="text-sm text-[#7A8744]">{date}</p>
          </div>
        </header>

        <main className="p-10">
          {/* 4. USE THE NEW 'greeting' STATE */}
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            {greeting} {welcomeName}!
          </h2>

          <div className="max-w-2xl space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                 <div className="flex items-center gap-3 mb-6">
                    <HiOutlineUserCircle className="w-7 h-7 text-gray-400" />
                    <h3 className="text-xl font-bold text-gray-700">Edit Profile</h3>
                  </div>
                  <form className="space-y-4" onSubmit={handleSaveProfile}>
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                      <input id="firstName" name="firstName" type="text" value={profileData.firstName} onChange={handleProfileChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A8744]" />
                    </div>
                     <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input id="lastName" name="lastName" type="text" value={profileData.lastName} onChange={handleProfileChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A8744]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username/Email (Cannot Change)</label>
                      <input type="text" value={username} disabled className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
                    </div>
                    <button type="submit" className="bg-[#7A8744] text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-[#69753A] transition-colors">Save Profile</button>
                  </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <HiOutlineLockClosed className="w-7 h-7 text-gray-400" />
                    <h3 className="text-xl font-bold text-gray-700">Security</h3>
                  </div>
                  <form className="space-y-4" onSubmit={handleChangePassword}>
                    <div>
                      <label htmlFor="currentPassword"  className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                      <input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
                    </div>
                    <button type="submit" className="bg-[#7A8744] text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-[#69753A] transition-colors">Change Password</button>
                  </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
               <div className="flex items-center gap-3 mb-4">
                  <HiOutlineExclamationCircle className="w-7 h-7 text-red-500" />
                  <h3 className="text-xl font-bold text-red-700">Danger Zone</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Reset All Habits</h4>
                    <p className="text-sm text-gray-600 mb-2">This will permanently delete all your habits and progress.</p>
                    <button onClick={handleResetHabits} className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-red-700 transition-colors">Reset Habits</button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Delete Account</h4>
                    <p className="text-sm text-gray-600 mb-2">This will permanently delete your account and all associated data.</p>
                    <button onClick={handleDeleteAccount} className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-red-700 transition-colors">Delete Account</button>
                  </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
