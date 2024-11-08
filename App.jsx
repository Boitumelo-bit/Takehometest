import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Register from './register';
import Login from './login';
import InventoryDashboard from './dashboard';
import InventoryManagement from './stockmanagement';
import UserManagement from './usermanagement';
import LogoutForm from './logout';
import './App.css';

// Layout component to handle navigation
function Layout({ children }) {
  const location = useLocation();
  
  // Hide nav for login and register pages
  const hideNav = location.pathname === '/' || location.pathname === '/login';
  
  return (
    <>
      {!hideNav && (
        <nav>
          <div className="logo">Wings Cafe</div>
          <ul>
            <li>
              <Link to="/inventory">Inventory Management</Link>
            </li>
            <li>
              <Link to="/usermanagement">User Management</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </nav>
      )}
      <div>{children}</div>
    </>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    // Retrieve user from localStorage if already logged in
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  });

  // Handle logout by clearing the session
  const handleLogout = () => {
    setLoggedInUser(null); // Clear logged-in user state
    localStorage.removeItem('loggedInUser'); // Remove user data from localStorage
  };

  // Store logged-in user in localStorage
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
  }, [loggedInUser]);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Login & Register Routes */}
          <Route path="/" element={<Login setLoggedInUser={setLoggedInUser} />} />
          <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
          <Route path="/register" element={<Register setUsers={setUsers} />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={loggedInUser ? <InventoryDashboard loggedInUser={loggedInUser} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/inventory" 
            element={loggedInUser ? <InventoryManagement /> : <Navigate to="/" />} 
          />
          <Route 
            path="/usermanagement" 
            element={loggedInUser ? <UserManagement /> : <Navigate to="/" />} 
          />
          
          {/* Logout Route */}
          <Route 
            path="/logout" 
            element={<LogoutForm onLogout={handleLogout} isLoggedIn={!!loggedInUser} />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
