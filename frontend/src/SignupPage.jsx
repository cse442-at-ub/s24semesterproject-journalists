import React, { useState } from "react";
import axios from "axios"; // Import Axios
import "./SignupPage.css";
import journalistFigure from "./assets/journalistfigure.svg";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    // Basic validation for demo purposes
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Sending the signup request to the backend
    axios
      .post("/backend/account/create_account.php", {
        email: email,
        password: password,
      })
      .then((response) => {
        // Handle response here
        console.log("Signup successful", response);
        if (response.status === 201) {
          // You can redirect the user to login page or display a success message
          alert(
            "Signup successful! Please check your email to verify your account."
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
        <br />
        <br />
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
