import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Journal_Dashboard.css';

const Journal_Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    // ... existing fetchMessages function
  };

  const postMessage = async (messageContent) => {
    // ... existing postMessage function
  };

  const handleSubmit = (e) => {
    // ... existing handleSubmit function
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="profile-page-container">
      <aside className="profile-sidebar">
        {/* You might want to load the image and name dynamically */}
        <img src="/path-to-profile-image.jpg" alt="Profile" className="profile-image" />
        <h2 className="profile-name">Thairone Pimentel</h2>
        <p className="profile-role">Journalist</p>
        <nav className="profile-navigation">
          {/* Navigation links or additional profile information */}
          <a href="#" className="nav-link">Edit profile</a>
          <a href="#" className="nav-link">Security</a>
          <a href="#" className="nav-link active">About</a>
        </nav>
      </aside>
      <main className="profile-main-content">
        <h1 className="about-title">About</h1>
        <p className="about-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <div className="project-info">
          <p className="project-label">CSE 442 Project</p>
        </div>
        <div className="guestbook-container">
          <h1 className="guestbook-title">Journal_Dashboard</h1>
          <form onSubmit={handleSubmit} className="guestbook-form">
            <textarea
              className="guestbook-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Leave a message..."
              required
            />
            <button type="submit" className="guestbook-submit-btn">
              Submit
            </button>
          </form>
          <ul className="guestbook-messages">
            {messages.map((message, index) => (
              <li key={index} className="guestbook-message-item">
                <p className="guestbook-message-content">{message.message}</p>
                <span className="guestbook-message-timestamp">
                  Posted on: {message.posted_on}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Guestbook;

