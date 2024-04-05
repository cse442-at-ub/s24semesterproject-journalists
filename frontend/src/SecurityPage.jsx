import React, { useState } from "react";
import "./SecurityPage.css"; // Make sure to create a corresponding CSS file
import { Link } from "react-router-dom";

const SecurityPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the password change logic here
    console.log(
      "Change password:",
      currentPassword,
      newPassword,
      confirmPassword
    );
  };

  return (
    <div className="security-page">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Existing Sidebar content */}
        <Link to="/Friend_Dashboard">Home</Link>
        <br></br>
        <br></br>
        <Link to="/edit-profile">Edit profile</Link>
        <br></br>
        <br></br>
        <Link to="/security-page">Security</Link>
        <br></br>
        <br></br>
        <Link to="/about">About</Link>
        <br></br>
        <br></br>
        {/* Add the Log Out link */}
        <Link to="/login-page" className="logout-button">
          Log Out
        </Link>
      </div>
      <main className="security-form">
        <div className="hamburger-menu" onClick={handleToggleSidebar}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h1>Security</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              required
            />
          </label>
          <label>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter password again"
              required
            />
          </label>
          <div className="form-actions">
            <button type="button" className="cancel">
              Cancel
            </button>
            <button type="submit" className="save">
              Save
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SecurityPage;
