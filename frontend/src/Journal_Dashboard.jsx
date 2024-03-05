import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Journal_Dashboard.css";

const Journal_Dashboard = () => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("/backend/journal/read.php", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJournalEntries(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };

    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("body", newMessage);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "/backend/journal/create.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        const newEntry = {
          id: response.data.id,
          title: newTitle,
          date: new Date().toLocaleDateString(),
          content: newMessage,
          image_path: response.data.image_path || "",
        };
        setJournalEntries([...journalEntries, newEntry]);
        setNewMessage("");
        setNewTitle("");
        setImageFile(null);
      }
    } catch (error) {
      console.error("Error submitting journal entry:", error);
    }
  };

  const handleNewEntry = () => {
    // Reset the form for a new entry
    setNewMessage("");
    setNewTitle("");
    setImageFile(null);
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
