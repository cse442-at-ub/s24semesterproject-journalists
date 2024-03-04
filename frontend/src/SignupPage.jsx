import React, { useState } from 'react';
import './SignupPage.css'; // Make sure to create a corresponding CSS file
import journalistFigure from './assets/journalistfigure.svg';
import { useNavigate } from 'react-router-dom';


const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();


  const handleSignup = (e) => {
    e.preventDefault();
    // Handle the signup logic here
    navigate("/journal");
    console.log('Signup with', email, password, confirmPassword);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
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
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
        <br></br>
        <br></br>

        <p>
          Already have an account? <a href="/login-page">Login</a>
        </p>
      </form>
      <div className="svg-container">
        <img src={journalistFigure} alt="Journalist Figure" />
      </div>
    </div>
    
  );
};

export default SignupPage;
