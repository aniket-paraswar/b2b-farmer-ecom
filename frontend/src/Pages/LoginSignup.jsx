import React, { useState } from 'react';
import './CSS/LoginSignup.css';

export const LoginSignup = () => {
  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    phone: "", // Replace email with phone
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    let responseData;
    await fetch('http://localhost:9813/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.result) {
      localStorage.setItem('x-access-token', responseData.token); // Save the token here
      window.location.replace("/"); // Redirect to home
    } else {
      alert(responseData.error);
    }
  };

  const signup = async () => {
    console.log("Sign Up Function Executed", formData);
    let responseData;
    await fetch('http://localhost:9813/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.result) {
      alert("Sign up successful! Please log in."); // Notify the user about the successful signup
      setState("Login"); // Switch to login mode
    } else {
      alert(responseData.error);
    }
  };

  return (
    <div className='loginSignup'>
      <div className="loginSignup-container">
        <h1>{state}</h1>
        <div className="loginSignup-fields">
          {state === 'Sign Up' ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={changeHandler}
              placeholder='Your name'
            />
          ) : null}
          <input
            type="text" // Change input type to text for phone
            name="phone" // Change name to phone
            value={formData.phone} // Use phone in the state
            onChange={changeHandler}
            placeholder='Enter phone number'
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder='Password'
          />
        </div>
        <button onClick={() => { state === 'Login' ? login() : signup(); }}>
          Continue
        </button>

        {state === 'Sign Up' ? (
          <p className="loginSignup-login">
            Already have an account? 
            <span onClick={() => { setState("Login"); }}>
              Login
            </span>
          </p>
        ) : (
          <p className="loginSignup-login">
            Create an account
            <span onClick={() => { setState("Sign Up"); }}>
              Sign Up
            </span>
          </p>
        )}

        <div className="loginSignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};