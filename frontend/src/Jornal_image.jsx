
import React, { useState } from 'react';
import './Journal_video.css'; // Ensure this path is correct
import mona_lisa from './assets/mona_lisa.jpeg'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const JournalImage = () => {
  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
    // ... add other entries if needed
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // Correctly added showDropdown state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { date: new Date().toLocaleDateString(), content: newMessage };
    setJournalEntries([...journalEntries, newEntry]);
    setNewMessage('');
  };

  const handleLogout = () => {
    navigate('/login-page');
    console.log("Logged out!");
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="journal-dashboard">
      <div className="left-column">
        <div className="header">
          <h1> <Link to='/journal'>Journalist</Link></h1>
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
        <button className="button orange logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="right-column">
        <p className="date">Date: {new Date().toLocaleDateString()}</p>
        <div className="image-container">
          <img
            className="journal-image"
            src={mona_lisa}
            alt="Journal Entry"
          />
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

export default JournalImage;
