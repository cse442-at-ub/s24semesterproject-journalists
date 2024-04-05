import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Journal_Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JournalVideo from "./Journal_video";

const Journal_Dashboard = () => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // State for selected entry.
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch entries periodically.
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchEntries();
    }, 5000); // polls every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle selecting an entry
  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Journalist/backend/journal/read.php",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setJournalEntries(response.data);
      console.log("entries fetched");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    }
  };

  useEffect(() => {
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
        "http://localhost/Journalist/backend/journal/create.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        console.log("entry added to database");
        setNewMessage("");
        setNewTitle("");
        setImageFile(null);
        await fetchEntries(); // Refresh the entries after a successful submission
      }
    } catch (error) {
      console.error("Error submitting journal entry:", error);
    }
  };
  const navigate = useNavigate();

  const JournalVideo = () => {
    navigate("/journal-video");
  };
  const journalImage = () => {
    navigate("/journal-image");
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
          <div
            className={`prompt-dropdown ${showPrompts ? "show-prompts" : ""}`}
          >
            <button onClick={togglePrompts} className="prompt-toggle-btn">
              New Entry {showPrompts ? "▲" : "▼"}
            </button>
            {showPrompts && (
              <div className="prompt-buttons">
                <button className="prompt-btn" onClick={JournalVideo}>
                  Video Prompt
                </button>
                <button className="prompt-btn" onClick={journalImage}>
                  Image Prompt
                </button>
              </div>
            )}
          </div>
          <div className="journal-history">
            {journalEntries.map((entry, index) => (
              <div
                key={index}
                className={`journal-entry ${
                  selectedEntry && selectedEntry.id === entry.id ? "active" : ""
                }`}
                onClick={() => setSelectedEntry(entry)}
              >
                <p>{entry.date}</p>
                <p>{entry.title}</p> {/* Assuming each entry has a title */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right-column-journal">
        <div className="date-display-journal">
          Date: {new Date().toLocaleDateString()}
        </div>
        {selectedEntry ? (
          <div>
            <h1 className="title-journal">{selectedEntry.title}</h1>
            <p className="textarea_journal">{selectedEntry.body}</p>
            {/* If there is an image with the entry, display it */}
            {selectedEntry.image && (
              <img src={selectedEntry.image_path} alt="Journal entry" />
            )}
            {/* You might want to have a button to clear the selection and show the entry form again */}
            <button onClick={() => setSelectedEntry(null)}>
              Write New Entry
            </button>
          </div>
        ) : (
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
        )}
        <div className="settings-icon">
          {" "}
          <Link to="/edit-profile">⚙</Link>
        </div>
      </div>
    </div>
  );
};

export default Journal_Dashboard;
