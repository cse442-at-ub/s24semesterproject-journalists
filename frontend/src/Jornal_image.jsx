import React, { useState } from "react";
import "./Journal_video.css"; // Ensure this path is correct
import mona_lisa from "./assets/mona_lisa.jpeg"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FiSettings, FiBookOpen } from 'react-icons/fi';


const JournalImage = () => {
  const [journalEntries, setJournalEntries] = useState([
    {
      date: "Feb 1, 2024",
      content: "Reflect on today’s day. Today was a busy day at work...",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Correctly added showDropdown state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      date: new Date().toLocaleDateString(),
      content: newMessage,
    };
    setJournalEntries([...journalEntries, newEntry]);
    setNewMessage("");
  };

  const journal = () => {
    navigate("/journal");
  };
  const JournalVideo = () => {
    navigate("/journal-video");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  return (
    <div className="journal-dashboard">
      <div className="left-column">
        <div className="header">
          <h1>
            {" "}
            <Link to="/journal">Journalist</Link>
          </h1>
          <div className="dropdown">
            <button className="button orange" onClick={toggleDropdown}>
              New Entry &#9662;
            </button>
            {showDropdown && (
              <div className={`dropdown-content${showDropdown ? " show" : ""}`}>
                <button className="dropdown-item" onClick={journal}>
                  Journal
                </button>
                <button className="dropdown-item" onClick={JournalVideo}>
                  Video Journal
                </button>
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
        <footer>
      <Link to="/journal-history" className="icon-link"><FiBookOpen /></Link>
        <Link to="/edit-profile" className="icon-link"><FiSettings /></Link>

      </footer>

      </div>
      <div className="right-column">
        <p className="date">Date: {new Date().toLocaleDateString()}</p>
        <div className="image-container">
          <img className="journal-image" src={mona_lisa} alt="Journal Entry" />
        </div>
        <textarea
          className="textarea-journal"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Reflect on today's day..."
        />
        <button className="button orange save-button" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default JournalImage;
