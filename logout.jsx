import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutForm = ({ onLogout, isLoggedIn }) => {
    const navigate = useNavigate(); // Hook for navigation

    const handleLogout = () => {
        // Perform any logout operations, like API calls or state updates
        onLogout(); // Call the function passed from the parent to handle logout

        // Redirect to the login page after logging out
        navigate('/'); // Change '/' to your desired route after logout if needed
    };

    return (
        <div className="logout-form">
            <h2>Logout</h2>
            <p>Are you sure you want to log out?</p>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
};

export default LogoutForm;
