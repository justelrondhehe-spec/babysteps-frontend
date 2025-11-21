// src/utils/api.js

import axios from 'axios';
import toast from 'react-hot-toast';

// This is our "API client"
const api = axios.create({
  baseURL: 'http://localhost:4000/api' // The base URL of our back-end
});

// This "interceptor" runs BEFORE every single request
api.interceptors.request.use(
  config => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('babyStepsToken');
    
    // 2. If the token exists, add it to the request headers
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// This "interceptor" runs AFTER every response
api.interceptors.response.use(
  (res) => res, // Just return the successful response
  (err) => {
    // If the error is a 401 (Unauthorized)
    if (err.response && err.response.status === 401) {
      // 1. Remove the bad token
      localStorage.removeItem('babyStepsToken');
      // 2. Reload the page (which will send them to the login screen)
      toast.error('Session expired. Please log in again.');
      // 3. We use a short delay to let the toast appear
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    return Promise.reject(err);
  }
);

export default api;