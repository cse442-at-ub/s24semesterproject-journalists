import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Journal.css";

const Journal = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // ... rest of your logic remains the same

  return (
    <div className="guestbook-container">
      <div className="guestbook-header">
        <h1>Journalist</h1>
        <button className="guestbook-button new-entry">New Entry</button>
      </div>
      <div className="guestbook-main-content">
        <textarea
          className="guestbook-input"
          placeholder="Reflect on today's day"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="journal-entry">
          <p>Today was a busy day at work. I had a lot of meetings and...</p>
          <p><small>Feb, 8th 2024</small></p>
        </div>
      </div>
      <button className="guestbook-button logout">Logout</button>
      <button className="settings-icon">⚙️</button>
    </div>
  );
};

export default Journal;
