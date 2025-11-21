// src/components/SignUpPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api'; // <-- CHANGE 1: Import our api tool
import { jwtDecode } from 'jwt-decode';
import { HiUser, HiLockClosed, HiMail } from 'react-icons/hi';

export default function SignUpPage({ setCurrentUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // CHANGE 2: Use 'api.post' and remove the full URL
      const response = await api.post(
        '/auth/register', 
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password
        }
      );

      const token = response.data.token;
      localStorage.setItem('babyStepsToken', token);
      sessionStorage.setItem('isNewUser', 'true');

      const decodedUser = jwtDecode(token);
      setCurrentUser(decodedUser.user);

      toast.success('Registration successful! Welcome!');
      navigate('/dashboard');

    } catch (err) {
      // api.js handles network errors, but we catch specific backend messages here
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  const backgroundStyle = {
    backgroundImage: `url('/background-pattern.png')`,
  };

  // (JSX remains exactly the same)
  return (
    <div style={backgroundStyle} className="h-screen w-screen bg-cover bg-center flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign Up</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiUser className="text-gray-400" /></div>
            <input type="text" name="firstName" placeholder="Enter First Name" value={formData.firstName} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiUser className="text-gray-400" /></div>
            <input type="text" name="lastName" placeholder="Enter Last Name" value={formData.lastName} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiMail className="text-gray-400" /></div>
            <input type="text" name="username" placeholder="Enter Username" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiLockClosed className="text-gray-400" /></div>
            <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiLockClosed className="text-gray-400" /></div>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8744]" required />
          </div>
          <div className="flex items-center justify-between pt-4">
            <button type="submit" className="bg-[#7A8744] text-white font-semibold py-2 px-8 rounded-lg shadow hover:bg-[#69753A] transition-colors">Register</button>
            <p className="text-sm">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline ml-1">Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}