import React, { useState } from 'react';
import axios from 'axios'; 
import './Journal_video.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const JournalVideo = () => {
  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { date: new Date().toLocaleDateString(), content: newMessage };
    setJournalEntries([...journalEntries, newEntry]);
    setNewMessage('');
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
        <h1> <Link to='/journal'>Journalist</Link></h1>
          <div className="dropdown">
            <button className="button orange" onClick={toggleDropdown}>New Entry &#9662;</button>
            {showDropdown && (
              <div className={`dropdown-content${showDropdown ? ' show' : ''}`}>
                {/* Updated onClick handlers to call the functions */}
                <button className="dropdown-item" onClick={journal}>Journal</button>
                <button className="dropdown-item" onClick={journalImage}>Image Journal</button>
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
