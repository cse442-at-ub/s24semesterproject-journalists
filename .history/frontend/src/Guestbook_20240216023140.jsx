import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Guestbook.css";

const Guestbook = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="guestbook-container">
      <h1 className="guestbook-title">Guestbook</h1>
      <form onSubmit={handleSubmit} className="guestbook-form">
        <textarea
          className="guestbook-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Leave a message..."
          required
        />
        <button type="submit" className="guestbook-submit-btn">
          Submit
        </button>
      </form>
      <ul className="guestbook-messages">
        {messages.map((message, index) => (
          <li key={index} className="guestbook-message-item">
            <p className="guestbook-message-content">{message.message}</p>
            <span className="guestbook-message-timestamp">
              Posted on: {message.posted_on}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Guestbook;
