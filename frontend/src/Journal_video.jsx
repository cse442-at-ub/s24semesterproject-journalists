import React, { useState } from 'react';
import axios from 'axios'; 
import './Journal_video.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import mona_lisa from "./assets/mona_lisa.jpeg"; // Ensure this path is correct


const JournalVideo = () => {
  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [contentMode, setContentMode] = useState('video');
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { date: new Date().toLocaleDateString(), content: newMessage };
    setJournalEntries([...journalEntries, newEntry]);
    setNewMessage('');
  };
  const handleDropdownSelection = (mode) => {
    setContentMode(mode);
  };

  const journal = () => {
    navigate('/journal');
  };
  const journalImage = () => {
    navigate('/journal-image');
  };
  

  const toggleDropdown = () => setShowDropdown(!showDropdown);

// Replace this with the actual token retrieval logic
  //const token = 'c31182978424e2c008e463e7a0fb2214'; // This should be the actual token of the authenticated user
  
  const deleteJournalEntry = async (entryId) => {
    try {
      // const response = await axios.get({"/backend/journal/read.php"
      const response = await axios({
        method: 'delete',
        url: '/backend/journal/delete.php',
        data: {
          entry_id: entryId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 200) {
        // Deletion was successful, remove the entry from state
        setJournalEntries((prevEntries) => 
          prevEntries.filter((entry) => entry.entry_id !== entryId)
        );
        console.log('Deletion successful:', response.data);
      } else {
        // Handle any non-200 status codes
        console.error('Failed to delete the entry:', response.data);
      }
    } catch (error) {
      // Handle errors, such as network problems or server being unreachable
      console.error('Error deleting the entry:', error.response);
    }
  };
  

  return (
    <div className="journal-dashboard">
      <div className="left-column">
        <div className="header">
        <h1> <Link to='/Friend_Dashboard'>Journalist</Link></h1>
        <div className="dropdown">
            <button className="button orange" onClick={toggleDropdown}>New Entry &#9662;</button>
            {showDropdown && (
            <div className={`dropdown-content${showDropdown ? ' show' : ''}`}>
            {/* Add new dropdown items for video and text journals */}
              <button className="dropdown-item" onClick={() => handleDropdownSelection('text')}>Text Journal</button>
              <button className="dropdown-item" onClick={() => handleDropdownSelection('video')}>Video Journal</button>
              <button className="dropdown-item" onClick={() => handleDropdownSelection('image')}>Image Journal</button>
            </div>
            )}
          </div>
        </div>
      <div className="entries">
          {journalEntries.map((entry, index) => (
            <div key={index} className="entry-container">
              <button className="entry" onClick={() => {/* handle select entry if needed */}}>
                <p className="entry-date">{entry.date}</p>
                <p className="entry-content">{entry.content}</p>
              </button>
              {/* Delete button for each entry */}
              <button className="button delete-button" onClick={() => deleteJournalEntry(index)}>
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