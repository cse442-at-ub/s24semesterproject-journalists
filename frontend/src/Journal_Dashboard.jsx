import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Journal_Dashboard.css";

const Journal_Dashboard = () => {
  const [showPrompts, setShowPrompts] = useState(false);


  const handleNewEntry = () => {
    // Reset the form for a new entry
    setNewMessage("");
    setNewTitle("");
    setImageFile(null);
  };

  const handleSubmit = () => {
    const newEntry = { date: new Date().toLocaleDateString(), content: newMessage };
    addJournalEntry(newEntry); // Assuming you have a function to add a new entry
    setNewMessage(''); // Clear the textarea after submission
  };
  
  const togglePrompts = () => {
    setShowPrompts(!showPrompts);
  };


  return (
    <div className="app-container-journal">
      <div className="left-column-journal">
        <div>
          <div className="journalist-label">Journalist</div>
          <button onClick={handleNewEntry} className="new-entry-btn">
            New Entry
          </button>
          <div
            className={`prompt-dropdown ${showPrompts ? "show-prompts" : ""}`}
          >
            <button onClick={togglePrompts} className="prompt-toggle-btn">
              Prompts {showPrompts ? "▲" : "▼"}
            </button>
            {showPrompts && (
              <div className="prompt-buttons">
                <button className="prompt-btn" onClick={journalVideo}>Video Prompt</button>
                <button className="prompt-btn" onClick={journalImage}>Image Prompt</button>
              </div>
            )}
          </div>
          <div className="journal-history">
            {journalEntries.map((entry, index) => (
              <div key={index} className="journal-entry">
                <p>{entry.date}</p>
                <p>{entry.content}</p>
                {/* Display image if available */}
                {entry.image_path && (
                  <img src={entry.image_path} alt="Journal Entry" />
                )}
              </div>
            ))}
          </div>
        </div>
        <button className="logout-btn">Logout</button>
      </div>
      <div className="right-column-journal">
        <div className="date-display-journal">
          Date: {new Date().toLocaleDateString()}
        </div>
        <div>
          <h1 className="title-journal">Reflect on today's day</h1>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title of your journal entry"
            required
          />
          <textarea
            className="textarea_journal"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Reflect on today's day..."
            required
          />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button onClick={handleSubmit}>Submit Entry</button>
        </div>

      </div>
    </div>
  );
};

export default Journal_Dashboard;
