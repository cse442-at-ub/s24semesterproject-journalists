import React, { useState } from "react";
import axios from "axios";
import "./SignupPage.css";
import journalistFigure from "./assets/journalistfigure.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Check if password meets the length requirement
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Basic validation for demo purposes
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Sending the signup request to the backend
    axios
      .post(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/account/create_account.php",
        {
          email: email,
          password: password,
        }
      )
      .then((response) => {
        // Handle response here
        console.log("Verification Email Sent", response);
        if (response.data.verified) {
          // Assuming your backend sends a `verified` flag in response
          navigate("/survey-page");
          alert("Email verified! Welcome to your Journal.");
        } else {
          alert(
            "Signup successful! Please check your email to verify your account. And then hit login to sign in!"
          );
        }
      })
      .catch((error) => {
        console.error("Signup error", error);
        alert("An error occurred during signup. Please try again.");
      });
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
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
          placeholder="Enter password (min 6 characters)"
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
        <br />
        <br />
        <p>
          Already have an account? <Link to="/login-page">Login</Link>
        </p>
      </form>
      <div className="svg-container">
        <img src={journalistFigure} alt="Journalist Figure" />
      </div>
    </div>
  );
};

export default SignupPage;
