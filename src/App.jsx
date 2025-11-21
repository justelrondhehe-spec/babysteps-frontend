// src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import api from './utils/api';
import { jwtDecode } from 'jwt-decode';

// Import all your components
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import AddHabits from './components/AddHabits';
import Progress from './components/Progress';
import Settings from './components/Settings';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('babyStepsToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [habits, setHabits] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [remindersFiredToday, setRemindersFiredToday] = useState(() => {
    const saved = localStorage.getItem('remindersFired');
    return saved ? JSON.parse(saved) : [];
  });

  const loadHabits = async () => {
    const token = localStorage.getItem('babyStepsToken');
    if (token) {
      try {
        const res = await api.get('/habits');
        setHabits(res.data);
      } catch (err) {
        console.error("Error loading habits:", err);
      }
    }
  };

  // Effect 1: Set user based on token on initial load
  useEffect(() => {
    const token = localStorage.getItem('babyStepsToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setCurrentUser(decodedUser.user);
      } catch (err) {
        console.error('Invalid token found:', err);
        localStorage.removeItem('babyStepsToken');
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  // Effect 2: Load habits whenever the currentUser changes
  useEffect(() => {
    if (currentUser) {
      loadHabits();
    } else {
      setHabits([]); // Clear habits if user logs out
    }
  }, [currentUser]);

  // Effect 3: Reminder logic
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      if (currentTime === "00:00") {
        setRemindersFiredToday([]);
        localStorage.setItem('remindersFired', JSON.stringify([]));
      }
      for (const habit of habits) {
        const habitId = habit._id || habit.id;
        if (habit.reminder === currentTime && !remindersFiredToday.includes(habitId)) {
          toast(`⏰ Reminder: Time for your habit! \n ${habit.name}`, { duration: 5000, icon: '🔔' });
          const newFiredList = [...remindersFiredToday, habitId];
          setRemindersFiredToday(newFiredList);
          localStorage.setItem('remindersFired', JSON.stringify(newFiredList));
        }
      }
    };
    checkReminders();
    const intervalId = setInterval(checkReminders, 15000);
    return () => clearInterval(intervalId);
  }, [habits, remindersFiredToday]);

  return (
    <BrowserRouter>
      <Toaster position="bottom-left" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<SignUpPage setCurrentUser={setCurrentUser} />} />

        {/* Protected App Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard habits={habits} loadHabits={loadHabits} currentUser={currentUser} /></PrivateRoute>}
        />
        <Route
          path="/add-habits"
          element={<PrivateRoute><AddHabits loadHabits={loadHabits} currentUser={currentUser} /></PrivateRoute>}
        />
        <Route
          path="/progress"
          element={<PrivateRoute><Progress habits={habits} currentUser={currentUser} /></PrivateRoute>}
        />
        {/* --- THIS IS THE UPDATED ROUTE --- */}
        <Route
          path="/settings"
          element={<PrivateRoute><Settings setHabits={setHabits} currentUser={currentUser} setCurrentUser={setCurrentUser} /></PrivateRoute>}
        />
        {/* ---------------------------------- */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
