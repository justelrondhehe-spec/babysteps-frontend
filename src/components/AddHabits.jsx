// src/components/AddHabits.jsx

import { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api'; 
import {
  HiViewGrid, 
  HiOutlinePlusCircle, 
  HiOutlineChartBar, 
  HiOutlineCog, 
  HiOutlineLogout, 
  HiOutlinePencilAlt
} from 'react-icons/hi';

export default function AddHabits({ loadHabits, currentUser }) {
  const navigate = useNavigate();
  const [habitName, setHabitName] = useState('');
  const [goalNum, setGoalNum] = useState(1);
  const [goalPeriod, setGoalPeriod] = useState('day');
  const [reminder, setReminder] = useState('09:00');
  const [greeting, setGreeting] = useState('Welcome back,'); // <-- 2. New state for greeting

  // 3. This effect checks for the "new user" flag ONCE
  useEffect(() => {
    const isNewUser = sessionStorage.getItem('isNewUser');
    if (isNewUser) {
      setGreeting('Welcome,');
      // We don't remove the flag here, Dashboard will handle it
    }
  }, []); // Empty array means this runs only once when the page loads

  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
  const date = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const handleLogout = () => {
    localStorage.removeItem('babyStepsToken');
    window.location.href = '/login';
  };

  const handleSaveHabit = async (e) => {
    e.preventDefault(); 
    try {
      const newHabit = {
        name: habitName,
        goal: goalNum,
        period: goalPeriod,
        reminder: reminder
      };
      await api.post('/habits', newHabit);
      toast.success('New habit saved!');
      
      setHabitName('');
      setGoalNum(1);
      setGoalPeriod('day');
      setReminder('09:00');

      await loadHabits();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Could not save habit');
    }
  };

  const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User';
  const username = currentUser ? currentUser.username : 'username@email.com';
  const welcomeName = currentUser ? currentUser.firstName : 'User';

  return (
    <div className="flex h-screen bg-gray-100">
      
      <div className="w-64 bg-gradient-to-b from-[#d2db9e] to-[#56562b] text-white flex flex-col">
        <div className="flex flex-col items-center p-6 border-b border-white/20">
          <img
            src="/user-avatar.png"
            alt="User Avatar"
            className="w-20 h-20 rounded-full mb-3 border-2 border-white"
          />
          <h3 className="font-semibold text-lg">{displayName}</h3>
          <p className="text-sm text-gray-200">{username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            <HiViewGrid className="w-6 h-6" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/add-habits"
            className="flex items-center gap-3 p-3 rounded-lg bg-white text-[#7A8744] font-semibold"
          >
            <HiOutlinePlusCircle className="w-6 h-6" />
            <span>Add Habits</span>
          </Link>
          <Link
            to="/progress"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            <HiOutlineChartBar className="w-6 h-6" />
            <span>Progress</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            <HiOutlineCog className="w-6 h-6" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-white/20 transition-colors"
          >
            <HiOutlineLogout className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex justify-between items-center p-6 bg-white border-b">
          <h1 className="text-xl text-gray-400">Add Habits</h1>
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

          <form 
            onSubmit={handleSaveHabit}
            className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <HiOutlinePencilAlt className="w-8 h-8 text-[#7A8744]" />
              <label className="text-xl font-semibold text-gray-700">Habit Name:</label>
              <input 
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <label className="text-xl font-semibold text-gray-700">Goal:</label>
              <input 
                type="number"
                value={goalNum}
                onChange={(e) => setGoalNum(e.target.value)}
                className="w-20 p-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
              <span className="text-xl text-gray-700">per</span>
              <select
                value={goalPeriod}
                onChange={(e) => setGoalPeriod(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="day">day</option>
                <option value="week">week</option>
                <option value="month">month</option>
              </select>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <label className="text-xl font-semibold text-gray-700">Reminder:</label>
              <input 
                type="time"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="bg-[#7A8744] text-white font-semibold py-2 px-8 rounded-lg shadow hover:bg-[#69753A] transition-colors"
            >
              Save Habit
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
