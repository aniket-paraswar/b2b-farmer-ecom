import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/logo.png';
import navProfile from '../../assets/nav-profile.svg';

export const Navbar = () => {
    // Logout function to clear local storage and refresh the page
    const handleLogout = () => {
        localStorage.removeItem('x-access-token'); // Remove the token from local storage
        window.location.reload(); // Reload the page to update the UI
    };

    return (
        <div className='navbar'>
            <img src={navlogo} alt="Logo" className="nav-logo" />
            <div className="navbar-actions">
                <img src={navProfile} alt="Profile" className="nav-profile" />
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};
