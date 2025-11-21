// src/components/AuthPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api'; // <-- CHANGE 1: Import api
import { jwtDecode } from 'jwt-decode';
import { HiUser, HiLockClosed } from 'react-icons/hi';

export default function AuthPage({ setCurrentUser }) { 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      // CHANGE 2: Use api.post and the short path
      const response = await api.post('/auth/login', formData);
      
      const token = response.data.token;
      localStorage.setItem('babyStepsToken', token);
      sessionStorage.removeItem('isNewUser');

      const decodedUser = jwtDecode(token);
      setCurrentUser(decodedUser.user);
      
      toast.success('Logged in successfully!');
      navigate('/dashboard');

    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    }
  };
      
  const backgroundStyle = {
    backgroundImage: `url('/background-pattern.png')`,
  };

  // (JSX remains exactly the same)
  return (
    <div style={backgroundStyle} className="h-screen w-screen bg-cover bg-center flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiUser className="text-gray-400" /></div>
            <input type="text" name="username" placeholder="Enter Username" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiLockClosed className="text-gray-400" /></div>
            <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
          </div>
          <div className="flex items-center justify-between pt-4">
            <button type="submit" className="bg-[#7A8744] text-white font-semibold py-2 px-8 rounded-lg shadow hover:bg-[#69753A] transition-colors">Login</button>
            <p className="text-sm">Don't have an account? <Link to="/signup" className="font-semibold text-blue-600 hover:underline ml-1">Create One</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}