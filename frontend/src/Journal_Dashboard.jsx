import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Journal_Dashboard.css";
import { Link } from "react-router-dom";

const Journal_Dashboard = () => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [journalEntries, setJournalEntries] = useState([
    {
      date: "Feb 1, 2024",
      content: "Reflect on today’s day. Today was a busy day at work...",
    },
    // ... more entries
  ]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get("/backend/journal/read.php", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace yourAuthToken with the actual token
        },
      });
      if (response.data) {
        setJournalEntries(response.data);
        console.log("successfully retrieved entries");
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // To prevent the form from refreshing the page

    try {
      const formData = new FormData();
      formData.append("title", "Your Title Here"); // Modify as needed
      formData.append("body", newMessage);
      // If you're including file uploads, append them here as well
      // formData.append('image', selectedFile); // Assuming you have a file input

      const response = await axios.post(
        "/backend/journal/create.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace yourAuthToken with the actual token
          },
        }
      );

      if (response.status === 201) {
        console.log("Journal entry created:", response.data);
        // Optionally, refresh entries or update UI accordingly
        fetchEntries(); // If you want to immediately see the new entry in your list
      }
    } catch (error) {
      console.error("Error submitting journal entry:", error);
    }
  };

  /*useEffect(() => {
    fetchMessages();
  }, []);*/

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
        <button className="logout-btn">Logout</button>
      </div>
      <div className="right-column-journal">
        <div className="date-display-journal">
          Date: {new Date().toLocaleDateString()}
        </div>
        <div>
          <h1 className="title-journal">Reflect on today's day</h1>
          <textarea
            className="textarea_journal"
            placeholder="Reflect on today's day..."
            required
          />
        </div>
        <div className="settings-icon">⚙</div>
        <div className="settings-links">
          <Link to="/edit-profile" className="settings-link">
            Edit Profile
          </Link>
          <Link to="/journal-image" className="settings-link">
            Journal Image
          </Link>
          <Link to="/journal-video" className="settings-link">
            Journal Video
          </Link>
          <Link to="/about" className="settings-link">
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Journal_Dashboard;
