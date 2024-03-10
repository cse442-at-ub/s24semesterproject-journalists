import React, { useState } from "react";
import "./LoginPage.css";
import journalistFigure from "./assets/journalistfigure.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/account/login.php",
        {
          email: email,
          password: password,
        }
      )
      .then((response) => {
        // Assuming the backend response includes a user_id and token when login is successful,
        // and includes an error field when there is a problem (invalid credentials, email not verified)
        if (
          response.data.user_id &&
          response.data.token &&
          !response.data.error
        ) {
          console.log("Login successful", response.data);

          localStorage.setItem("token", response.data.token);

          navigate("/journal"); // Only navigate to the journal/dashboard if login is successful and no error is present
        } else {
          // Handle any errors, such as invalid credentials or email not verified
          console.log("Login failed", response.data.error);
          alert(
            response.data.error.credentials ||
              response.data.error.verify ||
              "An error occurred during login. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Login error", error);
        alert("An error occurred. Please try again later.");
      });
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
          <button type="submit">Login</button>
          <p>
            Don't have an account? <Link to="/signup-page">Register</Link>
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
