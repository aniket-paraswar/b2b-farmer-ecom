import React, { useEffect, useState } from 'react';
import { Navbar } from './Components/Navbar/Navbar';
import { Admin } from './Pages/Admin/Admin';
import { LoginSignup } from './Pages/LoginSignup/LoginSignup'; // Import your LoginSignup component
import { useNavigate } from 'react-router-dom';

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if x-access-token exists in local storage
        const token = localStorage.getItem('x-access-token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/login'); // Redirect to login/signup page
        }
    }, [navigate]);

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <Navbar />
                    <Admin />
                </>
            ) : (
                <LoginSignup />
            )}
        </div>
    );
};
