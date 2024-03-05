import React, { useState } from 'react';
import './Journal_video.css';

const JournalVideo = () => {
  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
    // ... add other entries if needed
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

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
        <div className="entries">
          {journalEntries.map((entry, index) => (
            <button key={index} className="entry">
              <p className="entry-date">{entry.date}</p>
              <p className="entry-content">{entry.content}</p>
            </button>
          ))}
        </div>
        <button className="button orange logout-button">Logout</button>
      </div>
      <div className="right-column">
        <p className="date">Date: {new Date().toLocaleDateString()}</p>
        <div className="video-container">
          <iframe
            className="journal-video"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <textarea
          className="textarea-journal"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Reflect on today's day..."
        />
        <button className="button orange save-button" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default JournalVideo;

