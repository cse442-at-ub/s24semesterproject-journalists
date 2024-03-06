import React, { useState } from "react";
import "./LoginPage.css"; // Make sure to create a corresponding CSS file
import journalistFigure from "./assets/journalistfigure.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("/backend/account/login.php", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.user_id && response.data.token) {
          // Login was successful
          console.log("Login successful", response.data);

          // Store the token in local storage or context for future requests
          localStorage.setItem("token", response.data.token);

          // Redirect or update state to show login success
          // For example, you might want to redirect to the dashboard page
          // this.props.history.push('/dashboard');
        } else {
          // Handle any errors, such as invalid credentials or email not verified
          console.log("Login failed", response.data.error);
          // Show an error message to the user
          // e.g., setError(response.data.error);
        }
      })
      .catch((error) => {
        console.error("Login error", error);
        // Handle the error
        // e.g., setError('An error occurred. Please try again later.');
      });
    // Insert login logic here

    navigate("/journal");
    console.log("Login with", email, password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>
          Welcome to <span className="journalist-color">Journalist</span>
        </h1>
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
