import React, { useState } from 'react';
import './Journal_Dashboard.css';

const Journal_image = () => {
  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...', imageUrl: '' },
    // ... more entries
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since we're no longer handling images, we'll just add text entries
    const newEntry = { date: new Date().toLocaleDateString(), content: newMessage, imageUrl: '' };
    setJournalEntries([...journalEntries, newEntry]);
    setNewMessage('');
  };

  return (
    <div className="app-container-journal">
      <div className="left-column-journal">
        <div>
          <div className="journalist-label">Journalist</div>
          <button className="new-entry-btn" onClick={() => {}}>New Entry</button>
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
        <div className="date-display-journal">Date: {new Date().toLocaleDateString()}</div>
        <div>
          <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ababb152-13f6-4f84-ba28-aa04ce450fad/dfo6h61-2a1f10ef-928c-42b8-9ac6-017d88d0741f.png/v1/fit/w_672,h_700,q_70,strp/straight_face_cat_meme_by_y0urdist00rtedmeme_dfo6h61-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzAwIiwicGF0aCI6IlwvZlwvYWJhYmIxNTItMTNmNi00Zjg0LWJhMjgtYWEwNGNlNDUwZmFkXC9kZm82aDYxLTJhMWYxMGVmLTkyOGMtNDJiOC05YWM2LTAxN2Q4OGQwNzQxZi5wbmciLCJ3aWR0aCI6Ijw9NjcyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.l_2i8alMHTn2Pc7bLx85KylqBk46c5DDkWE3Q1I68j0" alt="Reflect on today's day" />
          <textarea
            className="textarea_journal"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Reflect on today's day..."
            required
          />
          <button onClick={handleSubmit}>Submit Entry</button>
        </div>
        <div className="settings-icon">⚙</div>
      </div>
    </div>
  );
};

export default Journal_image;