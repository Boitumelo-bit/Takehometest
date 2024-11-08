import React, { useState } from 'react';
import axios from 'axios';  // Import axios
import './register.css';    // Import your CSS file for styling

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleRegister = async (e) => {
    e.preventDefault();

    if (username === '' || password === '') {
      setErrorMessage('Please fill in both fields');
      return;
    }

    try {
      // Send POST request to the backend to register the user
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
      });

      // Handle success response
      setSuccessMessage(response.data.message);
      setUsername('');
      setPassword('');
      setErrorMessage('');
    } catch (error) {
      // Handle error response
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Error connecting to the server');
      }
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-heading">Welcome to Wings Cafe</h1>
      <form onSubmit={handleRegister} className="register-form">
        <fieldset>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input 
              id="username" 
              type="text" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
        </fieldset>

        {/* Show error message */}
        {errorMessage && <p className="message error">{errorMessage}</p>}
        {/* Show success message */}
        {successMessage && <p className="message success">{successMessage}</p>}

        <button type="submit" className="register-btn">Register</button>
      </form>
    </div>
  );
}

export default Register;
