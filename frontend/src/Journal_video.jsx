import React, { useState } from 'react';
import './Journal_video.css';
import { Link } from 'react-router-dom';

const JournalVideo = () => {
  // Initial state with a sample journal entry
  const [journalEntries, setJournalEntries] = useState([
    { id: 1, date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [contentMode, setContentMode] = useState('video');

  // Function to handle submission of a new journal entry
  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = journalEntries.length > 0 ? Math.max(...journalEntries.map(entry => entry.id)) + 1 : 1;
    const newEntry = {
      id: newId,
      date: new Date().toLocaleDateString(),
      content: newMessage
    };
    setJournalEntries([...journalEntries, newEntry]);
    setNewMessage('');
  };

  // Function to delete a journal entry
  const deleteJournalEntry = (entryId) => {
    setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
  };

  // Function to handle content mode selection from the dropdown
  const handleDropdownSelection = (mode) => {
    setContentMode(mode);
  };

  // Function to toggle the visibility of the dropdown menu
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="journal-dashboard">
      <div className="left-column">
        <div className="header">
          <h1><Link to='/Friend_Dashboard'>Journalist</Link></h1>
          <div className="dropdown">
            <button className="button orange" onClick={toggleDropdown}>New Entry &#9662;</button>
            {showDropdown && (
              <div className={`dropdown-content${showDropdown ? ' show' : ''}`}>
                <button className="dropdown-item" onClick={() => handleDropdownSelection('text')}>Text Journal</button>
                <button className="dropdown-item" onClick={() => handleDropdownSelection('video')}>Video Journal</button>
                <button className="dropdown-item" onClick={() => handleDropdownSelection('image')}>Image Journal</button>
              </div>
            )}
          </div>
        </div>
        <div className="entries">
          {journalEntries.map((entry) => (
            <div key={entry.id} className="entry-container">
              <div className="entry">
                <p className="entry-date">{entry.date}</p>
                <p className="entry-content">{entry.content}</p>
              </div>
              <button className="button delete-button" onClick={() => deleteJournalEntry(entry.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="right-column">
        <p className="date">Date: {new Date().toLocaleDateString()}</p>
        <div className="content-area">
          {contentMode === 'text' && (
            <div className="text-content">
              <h2>How was your day?</h2>
            </div>
          )}
          {contentMode === 'video' && (
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
          )}
          {contentMode === 'image' && (
            <div className="video-container">
              <img
                className="journal-image"
                src="https://mediaproxy.salon.com/width/1200/https://media2.salon.com/2014/01/wolf_wall_street2.jpg"
                alt="Journal Entry"
              />
            </div>
          )}
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