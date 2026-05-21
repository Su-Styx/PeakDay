// auth.js

import axios from 'axios';

// Function to login
export const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:8000/login/', { username, password });
    const token = response.data.token;
    // Save token to local storage
    localStorage.setItem('token', token);
    // Redirect or do other actions upon successful login
    console.log('Login successful');
  } catch (error) {
    // Handle login error
    console.error('Login failed:', error);
  }
}

// Function to fetch user data
export const fetchUserData = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/user/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = response.data;
      console.log('User data:', userData);
      // Use user data as needed
    } catch (error) {
      // Handle fetch user data error (possibly due to unauthenticated access)
      console.error('Failed to fetch user data:', error);
    }
  } else {
    // Handle case where no token is found (user is not logged in)
    console.log('User not logged in');
  }
}

// Function to logout
export const logout = () => {
  // Clear token from local storage
  localStorage.removeItem('token');
  // Redirect or do other actions upon logout
  console.log('Logout successful');
}
