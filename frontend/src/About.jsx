import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./About.css"; // Ensure this path is correct
import mona_lisa from "./assets/gg.jpg"; // Ensure this path is correct

const About = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
<div className="container">
  <div className="hamburger-menu" onClick={toggleSidebar}>
    <span></span>
    <span></span>
    <span></span>
  </div>

  <div className={`sidebar ${isSidebarVisible ? 'open' : ''}`}>
    <div className="menu">
      <div className="menu-item"><Link to="/Friend_Dashboard">Home</Link></div>
      <div className="menu-item"><Link to="/edit-profile">Edit Profile</Link></div>
      <div className="menu-item"><Link to="/security-page">Security</Link></div>
      <div className="menu-item active"><Link to="/about">About</Link></div>
      {/* Add the Log Out button here */}
      <div className="menu-item"><Link to="/login-page" className="logout-link">Log Out</Link></div>
    </div>
  </div>

      <div className="content">
        <div className="header">
          <h1 className="title">ABOUT</h1>
          <div className="role">Journalist</div>
        </div>
        <div className="image-container">
          <img className="journal-image" src={mona_lisa} alt="Journal Entry" />
        </div>
        <blockquote className="quote">
        Journalist is a dynamic online journaling platform tailored for University of Buffalo students.  Built with a React frontend and a robust PHP backend linked to a MySQL database, this platform allows for easy creation and sharing of journal entries, enabling students to connect and share their creative works with friends within their university community.        </blockquote>
      </div>
    </div>
  );
};

export default About;