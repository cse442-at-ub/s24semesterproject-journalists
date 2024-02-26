import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Journal_Dashboard.css';

const Journal_Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
    // ... more entries
  ]);

  const fetchMessages = async () => {
    // ... existing fetchMessages function
  };

  const postMessage = async (messageContent) => {
    // ... existing postMessage function
  };

  const handleSubmit = (e) => {
    // ... existing handleSubmit function
  };

  /*useEffect(() => {
    fetchMessages();
  }, []);*/

  return (
    <div className="app-container">
      <div className="left-column">
        <div>
          <div className="journalist-label">Journalist</div>
          <button className="new-entry-btn">New Entry</button>
          <div className="journal-history">
            {journalEntries.map((entry, index) => (
              <div key={index} className="journal-entry">
                <p>{entry.date}</p>
                <p>{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="logout-btn">Logout</button>
      </div>
      <div className="right-column">
        <div className="date-display">Date: {new Date().toLocaleDateString()}</div>
        <div>
          <h1 className="title">Reflect on today's day</h1>
          <textarea
            className="textarea"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Reflect on today's day..."
            required
          />
        </div>
        <div className="settings-icon">⚙</div>
      </div>
    </div>
  );
};

export default Journal_Dashboard;

