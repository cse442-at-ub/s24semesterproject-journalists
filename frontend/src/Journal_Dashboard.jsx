import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Journal_Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Journal_Dashboard = () => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
    // ... more entries
  ]);

  const handleNewEntry = () => {
    console.log('New Entry clicked');
  };
  const [newMessage, setNewMessage] = useState('');

  const togglePrompts = () => {
    setShowPrompts(!showPrompts);
  };
  

  const handleLogout = () => {
    navigate('/login-page');
    console.log("Logged out!");
  }
  return (
    <div className="app-container-journal">
      <div className="left-column-journal">
        <div>
          <div className="journalist-label">Journalist</div>
          <button onClick={handleNewEntry} className="new-entry-btn">New Entry</button>
          <div className={`prompt-dropdown ${showPrompts ? 'show-prompts' : ''}`}>
            <button onClick={togglePrompts} className="prompt-toggle-btn">
              Prompts {showPrompts ? '▲' : '▼'}
            </button>
            {showPrompts && (
              <div className="prompt-buttons">
                <button className="prompt-btn">Video Prompt</button>
                <button className="prompt-btn">Image Prompt</button>
              </div>
            )}
          </div>
          <div className="journal-history">
            {journalEntries.map((entry, index) => (
              <div key={index} className="journal-entry">
                <p>{entry.date}</p>
                <p>{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="right-column-journal">
        <div className="date-display-journal">Date: {new Date().toLocaleDateString()}</div>
        <div>
          <h1 className="title-journal">Reflect on today's day</h1>
          <textarea
            className="textarea_journal"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Reflect on today's day..."
            required
          />
          <button onClick={handleSubmit}>Submit Entry</button>

        </div>
       <div className="settings-icon"> <Link to='/edit-profile'>⚙</Link></div>
        <div className="settings-links">
          <Link to="/edit-profile" className="settings-link">Edit Profile</Link>
          <Link to="/journal-image" className="settings-link">Journal Image</Link>
          <Link to="/journal-video" className="settings-link">Journal Video</Link>
          <Link to="/about" className="settings-link">About Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Journal_Dashboard;
