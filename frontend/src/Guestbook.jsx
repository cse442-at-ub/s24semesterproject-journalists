import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // This is assuming you are using react-router for navigation
import './Guestbook.css';

const Journal = () => {
  const [entry, setEntry] = useState('');
  const history = useHistory(); // Hook for navigating to different routes

  // Function to handle New Entry: Clears the current journal entry
  const handleNewEntry = () => {
    setEntry('');
  };

  // Function to handle Logout: Clears user session and redirects to the login page
  const handleLogout = () => {
    // Assuming you have a function to clear the user's session or token
    clearUserSession(); // You need to implement this function

    // Redirect the user to the login page
    history.push('/login'); // Adjust the path as necessary for your application
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="journal-container">
      <div className="journal-nav">
        <h1>Journalist</h1>
        <button onClick={handleNewEntry} className="journal-button">New Entry</button>
        <button onClick={handleLogout} className="journal-button">Logout</button>
      </div>
      <div className="journal-content">
        <div className="journal-header">
          <h2 className="journal-title">Reflect on today's day...</h2>
          <span className="journal-date">{today}</span>
          {/* Placeholder for settings icon */}
          <span className="settings-icon">⚙️</span> 
        </div>
        <textarea
          className="journal-entry"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your reflection here..."
        />
      </div>
    </div>
  );
};

export default Journal;

// Helper function to clear the user session or token
function clearUserSession() {
  // Clear user data from local storage or cookies
  localStorage.removeItem('userToken'); // Example of clearing a token from local storage
  // Add any other cleanup logic here
}
