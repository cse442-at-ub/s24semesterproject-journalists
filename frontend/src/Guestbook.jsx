import React, { useState } from 'react';
import './Guestbook.css';

const Guestbook = () => {
  const [newMessage, setNewMessage] = useState('');

  // ... other state and functions

  const [messages, setMessages] = useState([]);

  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
    // ... more entries
  ]);

  // Function to fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/get-messages.php"
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to post a new message to the backend
  const postMessage = async (messageContent) => {
    try {
      const response = await axios.post(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/post-message.php",
        {
          message: messageContent,
        }
      );
      if (response.data.success) {
        fetchMessages(); // Re-fetch messages after posting
        setNewMessage(""); // Reset the input field
      }
    } catch (error) {
      console.error("Error posting new message:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    postMessage(newMessage);
  };

  // Fetch messages when component mounts
  /*useEffect(() => {
    fetchMessages();
  }, []);*/

  return (
    <div className="app-container">
      <div className="left-column">
        <div>
          <div className="journalist-label">Journalist</div>
          <button className="new-entry-btn">New Entry</button>
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
      <div className="right-column">
        <div className="date-display">Date: {new Date().toLocaleDateString()}</div>
        <div>
          <h1 className="title">Reflect on today's day</h1>
          <textarea
            className="textarea"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Reflect on today's day..."
            required
          />
        </div>
        <div className="settings-icon">⚙</div>
      </div>
    </div>
  );
};

export default Guestbook;
