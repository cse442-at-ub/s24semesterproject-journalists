import React, { useState } from 'react';
import './Journal_Dashboard.css';

const JournalVideo = () => {
  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
    // ... add other entries if needed
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { date: new Date().toLocaleDateString(), content: newMessage };
    setJournalEntries([...journalEntries, newEntry]);
    setNewMessage('');
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="journal-dashboard">
      <div className="left-column">
        <div className="header">
          <h1>Journalist</h1>
          <div className="dropdown">
            <button className="button orange" onClick={toggleDropdown}>New Entry &#9662;</button>
            {showDropdown && (
              <div className="dropdown-content">
                <button className="dropdown-item" onClick={() => {/* handle video journal entry */}}>Video Journal</button>
                <button className="dropdown-item" onClick={() => {/* handle image journal entry */}}>Image Journal</button>
              </div>
            )}
          </div>
        </div>
        <button className="logout-btn">Logout</button>
      </div>
      <div className="right-column">
        <p className="date">Date: {new Date().toLocaleDateString()}</p>
        <div className="image-container">
          {/* Replace 'path-to-your-image.jpg' with the correct path to your image */}
          <img
            className="journal-image"
            src= {mona_lisa}
            alt="Journal Entry"
          />
        </div>
        <div className="settings-icon">⚙</div>
        <div className="settings-icon">⚙</div>
      </div>
    </div>
  );
};

export default JournalVideo;
