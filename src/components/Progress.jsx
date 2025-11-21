// src/components/Progress.jsx

import { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  HiViewGrid, 
  HiOutlinePlusCircle, 
  HiOutlineChartBar, 
  HiOutlineCog, 
  HiOutlineLogout, 
  HiOutlineClipboardList,
  HiOutlineCalendar
} from 'react-icons/hi';

export default function Progress({ habits, currentUser }) {
  const navigate = useNavigate();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [greeting, setGreeting] = useState('Welcome back,'); // <-- 2. New state for greeting

  // 3. This effect checks for the "new user" flag ONCE
  useEffect(() => {
    const isNewUser = sessionStorage.getItem('isNewUser');
    if (isNewUser) {
      setGreeting('Welcome,');
    }
  }, []);

  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
  const date = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const totalHabits = habits.length;
  const finishedHabits = habits.filter(h => h.progress >= h.goal).length;
  const totalPercentageSum = habits.reduce((sum, habit) => {
    const percentage = habit.goal > 0 ? (habit.progress / habit.goal) * 100 : 0;
    return sum + percentage;
  }, 0);
  const overallPercentage = totalHabits > 0 ? totalPercentageSum / totalHabits : 0;

  const handleLogout = () => {
    localStorage.removeItem('babyStepsToken');
    window.location.href = '/login';
  };

  const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User';
  const username = currentUser ? currentUser.username : 'username@email.com';
  const welcomeName = currentUser ? currentUser.firstName : 'User';

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const todayDate = new Date();
      const isToday = 
        date.getDate() === todayDate.getDate() &&
        date.getMonth() === todayDate.getMonth() &&
        date.getFullYear() === todayDate.getFullYear();

      if (isToday) {
        const dailyHabits = habits.filter(h => h.period === 'day');
        const allDailyComplete = dailyHabits.length > 0 && dailyHabits.every(h => h.progress >= h.goal);
        
        if (allDailyComplete) {
          return 'bg-green-200! rounded-full';
        } else {
          return 'bg-blue-100! rounded-full';
        }
      }
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      <div className="w-64 bg-[#7A8744] text-white flex flex-col">
        <div className="flex flex-col items-center p-6 border-b border-white/20">
          <img src="/user-avatar.png" alt="User Avatar" className="w-20 h-20 rounded-full mb-3 border-2 border-white"/>
          <h3 className="font-semibold text-lg">{displayName}</h3>
          <p className="text-sm text-gray-200">{username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiViewGrid className="w-6 h-6" /><span>Dashboard</span></Link>
          <Link to="/add-habits" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiOutlinePlusCircle className="w-6 h-6" /><span>Add Habits</span></Link>
          <Link to="/progress" className="flex items-center gap-3 p-3 rounded-lg bg-white text-[#7A8744] font-semibold"><HiOutlineChartBar className="w-6 h-6" /><span>Progress</span></Link>
          <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors"><HiOutlineCog className="w-6 h-6" /><span>Settings</span></Link>
        </nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-white/20 transition-colors"><HiOutlineLogout className="w-6 h-6" /><span>Logout</span></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex justify-between items-center p-6 bg-white border-b">
          <h1 className="text-xl text-gray-400">Progress</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4"> <HiOutlineClipboardList className="w-7 h-7 text-gray-400" /> <h3 className="text-lg font-bold text-yellow-600"> Today's Summary </h3> </div>
                    <p className="text-2xl font-bold text-gray-700"> Finished Habits: {finishedHabits}/{totalHabits} </p>
                  </div>
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-gray-200" stroke="currentColor" strokeWidth="3.6" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /><path className="text-green-500" stroke="currentColor" strokeWidth="3.6" fill="none" strokeDasharray={`${overallPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /></svg>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-xl text-green-600"> {Math.round(overallPercentage)}% </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                 <div className="flex items-center gap-3 mb-6"> <HiOutlineClipboardList className="w-7 h-7 text-gray-400" /> <h3 className="text-lg font-bold text-yellow-600"> Detailed Breakdown </h3> </div>
                 <h4 className="text-xl font-bold text-gray-700 mb-4"> Existing Habits: </h4>
                 <div className="space-y-3">
                  {habits.length > 0 ? (
                    habits.map(habit => {
                      const habitId = habit._id || habit.id;
                      return ( <p key={habitId} className="text-lg text-gray-600"> <strong>{habit.name}:</strong> [{habit.progress}/{habit.goal}] </p> )
                    })
                  ) : ( <p className="text-lg text-gray-500"> No habits to track yet. </p> )}
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
               <div className="flex items-center gap-3 mb-6">
                 <HiOutlineCalendar className="w-7 h-7 text-gray-400" />
                 <h3 className="text-lg font-bold text-yellow-600">
                   Completion Calendar (Today)
                 </h3>
               </div>
               <div className="flex justify-center">
                 <Calendar
                   onChange={setCalendarDate}
                   value={calendarDate}
                   tileClassName={getTileClassName}
                   className="border-none"
                 />
               </div>
               <p className="text-xs text-gray-500 mt-4 text-center">
                 Today is highlighted green if all daily habits are complete. Past days not tracked with current data model.
               </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
