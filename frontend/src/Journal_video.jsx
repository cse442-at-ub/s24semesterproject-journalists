import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Journal_video.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import mona_lisa from "./assets/mona_lisa.jpeg"; // Ensure this path is correct
import wolf from "./assets/wolf.jpg";

const JournalVideo = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [contentMode, setContentMode] = useState("video");
  const [newTitle, setNewTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);

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
      const response = await axios.get("https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/journal/read.php", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/journal/create.php",
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

  const handleDropdownSelection = (mode) => {
    setContentMode(mode);
  };

  const journal = () => {
    navigate("/journal");
  };
  const journalImage = () => {
    navigate("/journal-image");
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]); // Set the image file when it's selected
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Replace this with the actual token retrieval logic
  //const token = 'c31182978424e2c008e463e7a0fb2214'; // This should be the actual token of the authenticated user

  const deleteJournalEntry = async (entryId) => {
    try {
      // const response = await axios.get({"/backend/journal/read.php"
      const response = await axios({
        method: "delete",
        url: "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/journal/delete.php",
        data: {
          entry_id: entryId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        // Deletion was successful, remove the entry from state
        setJournalEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.entry_id !== entryId)
        );
        console.log("Deletion successful:", response.data);
      } else {
        // Handle any non-200 status codes
        console.error("Failed to delete the entry:", response.data);
      }
    } catch (error) {
      // Handle errors, such as network problems or server being unreachable
      console.error("Error deleting the entry:", error.response);
    }
  };

  return (
    <div className="journal-dashboard">
      <div className="left-column">
        <div className="header">
          <h1>
            {" "}
            <Link to="/Friend_Dashboard">Journalist</Link>
          </h1>
          <div className="dropdown">
            <button className="button orange" onClick={toggleDropdown}>
              New Entry &#9662;
            </button>
            {showDropdown && (
              <div className={`dropdown-content${showDropdown ? " show" : ""}`}>
                {/* Add new dropdown items for video and text journals */}
                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownSelection("text")}
                >
                  Text Journal
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownSelection("video")}
                >
                  Video Journal
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownSelection("image")}
                >
                  Image Journal
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="entries">
          {journalEntries.map((entry, index) => (
            <div key={index} className="entry-container">
              <button
                className="entry"
                onClick={() => {
                  /* handle select entry if needed */
                }}
              >
                <p className="entry-date">{entry.date}</p>
                <p className="entry-content">{entry.content}</p>
              </button>
              {/* Delete button for each entry */}
              <button
                className="button delete-button"
                onClick={() => deleteJournalEntry(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="right-column">
        <p className="date">Date: {new Date().toLocaleDateString()}</p>
        <div className="content-area">
          {contentMode === "text" && (
            <div className="text-content">
              <h2>How was your day?</h2>
            </div>
          )}
          {contentMode === "video" && (
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
          {contentMode === "image" && (
            <div className="video-container">
              <img className="journal-image" src={wolf} alt="Journal Entry" />
            </div>
          )}
        </div>
        <div className="title-input-container">
          <input
            type="text"
            className="title-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title of your entry"
          />
        </div>
        <div className="file-input-container">
          <input
            type="file"
            className="file-input"
            onChange={handleImageChange}
            accept="image/*"
          />
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

export default JournalVideo;
