import React, { useState } from 'react';
import './Journal_Dashboard.css';

const Journal_image = () => {
  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...', imageUrl: '' },
    // ... more entries
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [newImage, setNewImage] = useState(''); // State to hold the new image URL

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you might want to handle the upload to your server or a cloud service
    const newEntry = { date: new Date().toLocaleDateString(), content: newMessage, imageUrl: newImage };
    setJournalEntries([...journalEntries, newEntry]);
    // Resetting form
    setNewMessage('');
    setNewImage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setNewImage(imageUrl);
  };

  return (
    <div className="app-container-journal">
      <div className="left-column-journal">
        <div>
          <div className="journalist-label">Journalist</div>
          {/* You might want to handle the New Entry button functionality */}
          <button className="new-entry-btn">New Entry</button>
          <div className="journal-history">
            {journalEntries.map((entry, index) => (
              <div key={index} className="journal-entry">
                <p>{entry.date}</p>
                {entry.imageUrl && <img src={entry.imageUrl} alt="Journal entry" style={{ maxWidth: '100%', height: 'auto' }} />}
                <p>{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="logout-btn">Logout</button>
      </div>
      <div className="right-column-journal">
        <div className="date-display-journal">Date: {new Date().toLocaleDateString()}</div>
        <div>
          {/* Embedded YouTube video */}
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          
          <textarea
            className="textarea_journal"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Reflect on today's day..."
            required
          />
          <button onClick={handleSubmit}>Submit Entry</button>
        </div>
      </div>
    </div>
  );
};

export default Journal_image;
