// Login Function
import axios from 'axios';
const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/login/', { username, password });
      const token = response.data.token;
      // Save token to local storage
      localStorage.setItem('token', token);
      // Redirect or do other actions upon successful login
    } catch (error) {
      // Handle login error
    }
  }
  
  // Fetch User Data Function
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/user/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = response.data;
        // Use user data as needed
      } catch (error) {
        // Handle fetch user data error (possibly due to unauthenticated access)
      }
    } else {
      // Handle case where no token is found (user is not logged in)
    }
  }
  
  // Logout Function
  const logout = () => {
    // Clear token from local storage
    localStorage.removeItem('token');
    // Redirect or do other actions upon logout
  }
  