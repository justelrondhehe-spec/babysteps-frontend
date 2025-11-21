// src/components/Dashboard.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiViewGrid, HiOutlinePlusCircle, HiOutlineChartBar, HiOutlineCog, HiOutlineLogout, HiOutlinePencilAlt, HiOutlineTrash,
  HiOutlinePencil
} from 'react-icons/hi';

// --- Edit Modal Component ---
function EditHabitModal({ habit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: habit.name,
    goal: habit.goal,
    period: habit.period,
    reminder: habit.reminder || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(habit._id || habit.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">Edit Habit</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal:</label>
              <input type="number" name="goal" value={formData.goal} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" min="1" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Period:</label>
              <select name="period" value={formData.period} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                <option value="day">day</option>
                <option value="week">week</option>
                <option value="month">month</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reminder:</label>
            <input type="time" name="reminder" value={formData.reminder} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" className="bg-[#7A8744] text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-[#69753A]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// --- End of Edit Modal Component ---


export default function Dashboard({ habits, loadHabits, currentUser }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [greeting, setGreeting] = useState('Welcome back,');

  // This effect checks for the "new user" flag ONCE
  useEffect(() => {
    const isNewUser = sessionStorage.getItem('isNewUser');
    if (isNewUser) {
      setGreeting('Welcome,');
      // Remove the flag so it only shows "Welcome," once per session
      sessionStorage.removeItem('isNewUser');
    }
  }, []); // Empty array means this runs only once when the page loads

  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
  const date = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const handleLogout = () => {
    localStorage.removeItem('babyStepsToken');
    window.location.href = '/login';
  };

  const handleLogProgress = async (habitId) => {
    try {
      const id = habitId._id || habitId;
      await api.put(`/habits/${id}/log`); 
      await loadHabits();
      toast.success('Progress logged!');
    } catch (err) { console.error(err); toast.error('Could not log progress'); }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        const id = habitId._id || habitId;
        await api.delete(`/habits/${id}`);
        await loadHabits();
        toast.success('Habit deleted.');
      } catch (err) { console.error(err); toast.error('Could not delete habit'); }
    }
  };

  const handleOpenEditModal = (habit) => {
    setHabitToEdit(habit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setHabitToEdit(null);
  };

  const handleSaveChanges = async (habitId, updatedData) => {
    try {
      const id = habitId._id || habitId;
      await api.put(`/habits/${id}`, updatedData); 
      await loadHabits();
      toast.success('Habit updated!');
      handleCloseModal();
    } catch (err) {
      console.error(err);
      toast.error('Could not update habit');
    }
  };

  const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User';
  const username = currentUser ? currentUser.username : 'username@email.com';
  const welcomeName = currentUser ? currentUser.firstName : 'User';

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-[#7A8744] text-white flex flex-col">
         <div className="flex flex-col items-center p-6 border-b border-white/20">
          <img src="/user-avatar.png" alt="User Avatar" className="w-20 h-20 rounded-full mb-3 border-2 border-white" />
          <h3 className="font-semibold text-lg">{displayName}</h3>
          <p className="text-sm text-gray-200">{username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg bg-white text-[#7A8744] font-semibold"><HiViewGrid className="w-6 h-6" /><span>Dashboard</span></Link>
          <Link to="/add-habits" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiOutlinePlusCircle className="w-6 h-6" /><span>Add Habits</span></Link>
          <Link to="/progress" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiOutlineChartBar className="w-6 h-6" /><span>Progress</span></Link>
          <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiOutlineCog className="w-6 h-6" /><span>Settings</span></Link>
        </nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-white/20 transition-colors"><HiOutlineLogout className="w-6 h-6" /><span>Logout</span></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex justify-between items-center p-6 bg-white border-b">
           <h1 className="text-xl text-gray-400">Dashboard</h1>
          <div className="text-right">
            <p className="font-semibold text-gray-700">{weekday}</p>
            <p className="text-sm text-[#7A8744]">{date}</p>
          </div>
        </header>

        <main className="p-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            {greeting} {welcomeName}!
          </h2>
          {habits.length === 0 ? (
             <div className="bg-white rounded-lg shadow-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">No Habits Yet! Click "Add Habits" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map(habit => {
                const percentage = habit.goal > 0 ? (habit.progress / habit.goal) * 100 : 0;
                const isComplete = habit.progress >= habit.goal;
                const habitId = habit._id || habit.id;
                return (
                  <div key={habitId} className="bg-white rounded-lg shadow-lg p-6 flex flex-col relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                       <button
                         onClick={() => handleOpenEditModal(habit)}
                         className="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
                         aria-label="Edit habit"
                       >
                         <HiOutlinePencil className="w-5 h-5" />
                       </button>
                       <button
                         onClick={() => handleDeleteHabit(habitId)}
                         className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors"
                         aria-label="Delete habit"
                       >
                         <HiOutlineTrash className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="flex justify-between items-start mb-4 pt-6">
                      <div className="flex items-center gap-3">
                        <HiOutlinePencilAlt className="w-7 h-7 text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-800">
                          Habit: {habit.name}
                        </h3>
                      </div>
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-gray-200" stroke="currentColor" strokeWidth="3.6" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /><path className="text-green-500" stroke="currentColor" strokeWidth="3.6" fill="none" strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /></svg>
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-sm text-green-600">{Math.round(percentage)}%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-md font-semibold text-gray-700">
                        Goal: {habit.goal} times/{habit.period}
                      </p>
                      <p className="text-md font-semibold text-gray-700">
                        Progress: {habit.progress}/{habit.goal}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLogProgress(habitId)}
                      disabled={isComplete}
                      className={`mt-4 font-semibold py-2 px-6 rounded-lg shadow w-full transition-colors ${isComplete ? 'bg-green-100 text-green-600' : 'bg-[#7A8744] text-white hover:bg-[#69753A]'}`}
                    >
                      {isComplete ? 'Completed!' : 'Log One'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {isModalOpen && habitToEdit && (
        <EditHabitModal 
          habit={habitToEdit} 
          onClose={handleCloseModal} 
          onSave={handleSaveChanges} 
        />
      )}
    </div>
  );
}
