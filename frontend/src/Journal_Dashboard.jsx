import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Journal_Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Journal_Dashboard = () => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    title: "",
    message: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const navigate = useNavigate();
 
  const Friends = () => {
    navigate('/Friend_Dashboard'); // Replace '/journalist-page' with the actual route you want to navigate to
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchEntries();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
  };
  const handleGeneratePrompt = () => {
    const prompts = [
      "What made you smile today?",
      "Reflect on today's challenges.",
      "Describe a memorable moment from today.",
      "What did you learn today?",
      "Write about something you're grateful for."
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPromptText(randomPrompt);  // Correct usage
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      setImageFile(e.target.files[0]);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await axios.post(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/journal/delete.php",
        JSON.stringify({ entry_id: entryId }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        // Assuming status 200 means delete was successful
        // Now filter out the deleted entry from the journal entries
        setJournalEntries(
          journalEntries.filter((entry) => entry.id !== entryId)
        );
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/journal/read.php",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setJournalEntries(response.data);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    }
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!newTitle.trim()) {
      errors.title = "Title cannot be blank.";
      formIsValid = false;
    }

    if (!newMessage.trim()) {
      errors.message = "Message cannot be blank.";
      formIsValid = false;
    }

    setErrorMessages(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setNewMessage("");
        setNewTitle("");
        setImageFile(null);
        setImagePreviewUrl("");
        await fetchEntries();
      }
    } catch (error) {
      console.error("Error submitting journal entry:", error);
    }
  };

  const JournalVideo = () => {
    navigate("/journal");
  };
  const journalImage = () => {
    navigate("/journal-image");
  };

  const handleNewEntry = () => {
    setNewMessage("");
    setNewTitle("");
    setImageFile(null);
    setImagePreviewUrl("");
    setSelectedEntry(null); // Add this line to reset the selected entry
  };


  const [promptText, setPromptText] = useState("Reflect on today's day");

  return (
    <div className="app-container-journal">
      <div className="left-column-journal">
        <div>
          <div className="journal-header">
          <div
                className="journalist-label"
                onClick={Friends} // Use navigate inside this function
                style={{ cursor: 'pointer' }}  // Optional, for visual feedback that it's clickable
            >
                Journalist
            </div>              
                <button onClick={JournalVideo} className="prompt-toggle-btn">
                  New Entry 
                </button>

            
              </div>
              <div className="journal-history">
                {journalEntries.map((entry, index) => (
                  <div
                    key={index}
                    className={`journal-entry ${
                      selectedEntry && selectedEntry.id === entry.id ? "active" : ""
                    }`}
                  >
                    <div onClick={() => handleSelectEntry(entry)}>
                      <p className="entry-date">{entry.date}</p>
                      <h3 className="entry-title">{entry.title}</h3>
                      <p className="entry-snippet">
                        {entry.body.length > 100
                          ? `${entry.body.substring(0, 100)}...`
                          : entry.body}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
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
            {selectedEntry.image_path && (
              <img
                src={selectedEntry.image_path}
                alt="Journal entry"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            )}
            <h1 className="title-journal">{selectedEntry.title}</h1>
            <p className="textarea_journal">{selectedEntry.body}</p>
            <button onClick={handleNewEntry}>Write New Entry</button>
          </div>
        ) : (
          <div>
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            )}
            
            <h1 className="title-journal">{promptText}</h1>
            <button className="button entry" onClick={handleGeneratePrompt}>Generate New Prompt</button>

            <input
              className="title-input"
              type="text"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                setErrorMessages((prevErrors) => ({
                  ...prevErrors,
                  title: "",
                }));
              }}
              placeholder="Title of your journal entry"
            />
            {errorMessages.title && (
              <div className="error-message">{errorMessages.title}</div>
            )}

            <textarea
              className="textarea_journal"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setErrorMessages((prevErrors) => ({
                  ...prevErrors,
                  message: "",
                }));
              }}
              placeholder="Reflect on today's day..."
            />
            {errorMessages.message && (
              <div className="error-message">{errorMessages.message}</div>
            )}
            <div>
  <input
    id="file"
    className="file-input"
    type="file"
    accept=".png, .jpg, .jpeg"
    onChange={handleImageChange}
  />
  <label htmlFor="file" className="file-input-label">Choose File</label>
</div>


            
            <button className=" orange" onClick={handleSubmit}>Submit Entry</button>
          </div>
        )}
        <div className="settings-icon">
          <Link to="/edit-profile">⚙</Link>
        </div>
      </div>
    </div>
  );
};

export default Journal_Dashboard;
