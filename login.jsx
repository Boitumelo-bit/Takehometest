import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login({ setLoggedInUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const navigate = useNavigate();

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if username and password are provided
    if (username === '' || password === '') {
      setErrorMessage('Please fill in both fields');
      return;
    }

    try {
      // Make an API request to the backend for login
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      // Check if login was successful
      if (response.data.message === 'Login successful') {
        const user = response.data.user;
        setLoggedInUser(user); // Update logged-in user state
        setWelcomeMessage(`Welcome to Wings Cafe, ${user.username}!`);
        setErrorMessage(''); // Clear error message

        // Clear input fields after successful login
        setUsername('');
        setPassword('');

        // Optional: Delay navigation to let the user see the welcome message
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to dashboard after 2 seconds
        }, 2000);
      }
    } catch (error) {
      // Log error for debugging
      console.error('Login error:', error.response);

      // Ensure the error message is defined
      const message = error.response?.data?.message || 'An error occurred during login';
      setErrorMessage(message);
      setWelcomeMessage(''); // Clear welcome message on error
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Welcome to Wings Cafe</h1>

      {/* Show the welcome message if it's set */}
      {welcomeMessage && <p className="welcome-message">{welcomeMessage}</p>}

      {/* Login form */}
      <form onSubmit={handleLogin} className="login-form">
        <fieldset>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
        </fieldset>

        {/* Display error message if login failed */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Submit button */}
        <button type="submit" className="login-btn">Login</button>

        {/* Link to the registration page */}
        <p className="register-link">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="register-button">
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
