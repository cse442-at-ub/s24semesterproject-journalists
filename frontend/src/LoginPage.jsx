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
    console.log("login...");
    axios
      .post(
        "/backend/account/login.php",
        {
          email: email,
          password: password,
        }
      )
      .then((response) => {
        // Check for a successful response including a user_id and token,
        // and no reported errors
        if (
          response.data.user_id &&
          response.data.token &&
          !response.data.error
        ) {
          console.log("Login successful", response.data);
          localStorage.setItem("token", response.data.token);

          // Use the first_login flag from the response to determine navigation
          if (response.data.first_login) {
            navigate("/survey-page"); // Navigate to the survey page on first login
          } else {
            navigate("/Friend_Dashboard"); // Navigate to the dashboard on subsequent logins
          }
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
