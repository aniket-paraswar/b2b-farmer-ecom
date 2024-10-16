import React, { useState, useRef } from 'react'; 
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import nav_dropdown from '../Assets/nav_dropdown.png';

export const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const menuRef = useRef();
    const navigate = useNavigate(); // Using useNavigate for programmatic navigation

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    };

    const handleLogout = () => {
        localStorage.removeItem('x-access-token'); // Remove token from local storage
        navigate('/'); // Redirect to home
    };

    const handleLoginClick = () => {
        navigate('/login'); // Redirect to login/signup page
    };

    const handleCartClick = () => {
        if (localStorage.getItem('x-access-token')) {
            navigate('/cart'); // Redirect to cart page
        } else {
            handleLoginClick(); // Redirect to login page
        }
    };

    const handleTransactionsClick = () => {
        navigate('/transactions'); // Redirect to transactions page
    };

    const isUserLoggedIn = !!localStorage.getItem('x-access-token'); // Check if the user is logged in

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="Logo" />
                <p>SHOPPER</p>
            </div>
            <img className='nav-dropdown' src={nav_dropdown} onClick={dropdown_toggle} alt="Dropdown" />
            <ul ref={menuRef} className='nav-menu'>
                <li onClick={() => setMenu("shop")}>
                    <Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>
                    {menu === "shop" ? <hr /> : null}
                </li>
                <li onClick={() => setMenu("fruits")}>
                    <Link style={{ textDecoration: 'none' }} to='/fruits'>Fruits</Link>
                    {menu === "fruits" ? <hr /> : null}
                </li>
                <li onClick={() => setMenu("vegetables")}>
                    <Link style={{ textDecoration: 'none' }} to='/vegetables'>Vegetables</Link>
                    {menu === "vegetables" ? <hr /> : null}
                </li>
                <li onClick={() => setMenu("grains")}>
                    <Link style={{ textDecoration: 'none' }} to='/grains'>Grains</Link>
                    {menu === "grains" ? <hr /> : null}
                </li>
            </ul>
            <div className='nav-login-cart'>
                {isUserLoggedIn ? (
                    <>
                        <button onClick={handleLogout}>Logout</button>
                        <button onClick={handleTransactionsClick}>Transactions</button>
                    </>
                ) : (
                    <button onClick={handleLoginClick}>Login</button>
                )}
                <img src={cart_icon} alt="Cart" onClick={handleCartClick} style={{ cursor: 'pointer' }} />
                <div className="nav-cart-count">{/* Get total cart items here */}</div>
            </div>
        </div>
    );
};
