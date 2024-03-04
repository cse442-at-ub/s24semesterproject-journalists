import React, { useState } from 'react';
import './LoginPage.css'; // Make sure to create a corresponding CSS file
import journalistFigure from './assets/journalistfigure.svg';
import { useNavigate } from 'react-router-dom';




const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Insert login logic here
    
    navigate("/journal");
    console.log('Login with', email, password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
      <h1>Welcome to <span className="journalist-color">Journalist</span></h1>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
       <div className="footer">
          {/*<a href="/forgot-password" className="forgot-password">Forgot Password</a>?*/}
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/signup-page">Register</a>
          </p>
        </div>
      </form>
      <div className="svg-container">
        <img src={journalistFigure} alt="Journalist Figure" />
      </div>
    </div>
  );
};

export default LoginPage;
