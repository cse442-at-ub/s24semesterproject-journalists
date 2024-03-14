import React, { useState } from 'react';
import './JournalPage.css'; // The CSS file will contain all the styling for responsiveness

const Dashboard = () => {
const [showDropdown, setShowDropdown] = useState(false);
const toggleDropdown = () => setShowDropdown(!showDropdown);
    
    return (
      <div className="dashboard">
        <div className="left-sidebar">
          <h1>Jounalist</h1>
          <div className="dropdown">
            <button onClick={toggleDropdown} className="dropdown-button">
              New Entry
            </button>
            {showDropdown && (
              <div className="dropdown-content">
                <div className="dropdown-item">Video Journal</div>
                <div className="dropdown-item">Image Journal</div>
                <div className="dropdown-item">Text Journal</div>
              </div>
            )}
          </div>
          <div className="journal-entry">
            <p>Mar 10th</p>
            <p>Reflect on today's day. Today was a busy day at work...</p>
          </div>
          {/* Add more entries if needed */}
        </div>
        <div className="middle-placeholder">
          {/* Placeholder for the middle content */}
        </div>
        <div className="right-sidebar">
          <h2>Max2_s</h2>
          <input type="email" placeholder="Enter friend’s email" />
          {/* Additional elements for the right sidebar */}
        </div>
      </div>
    );
  };
  
  export default Dashboard;
