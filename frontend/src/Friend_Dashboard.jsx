import React, { useState } from 'react';
import './JournalPage.css';
import monaLisaImage from './assets/mona_lisa.jpeg'; // Adjust the import path as needed

// ContentCard component
const ContentCard = ({ id, type, content, description, onUpdate }) => {
  const [comment, setComment] = useState('');

  const renderMedia = () => {
    switch (type) {
      case 'image':
        return <img src={content} alt="user-post" />;
      case 'video':
        // Assuming content is the embed URL
        return <iframe src={content} frameBorder="0" allowFullScreen title="video"></iframe>;
      case 'text':
      default:
        return <p>{content}</p>;
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentButtonClick = () => {
    onUpdate(id, comment); // This will now send the new comment up to the Dashboard component to update the description
    setComment(''); // Reset comment input after submission
  };

  return (
    <div className="content-card">
      <div className="media">{renderMedia()}</div>
      <div className="description">
        <p>{description}</p>
        <input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Leave a comment..."
          className="comment-input"
        />
        <button onClick={handleCommentButtonClick} className="comment-button">
          Comment
        </button>
      </div>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [contentItems, setContentItems] = useState([
    { id: 1, type: 'text', content: 'This is a text post.', description: 'Posted on Mar 10th' },
    { id: 2, type: 'image', content: monaLisaImage, description: 'Image posted on Mar 11th' },
    { id: 3, type: 'video', content: 'https://www.youtube.com/embed/ehJ6oQHSkCk', description: 'Video posted on Mar 11th' },
  ]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleUpdateDescription = (id, newComment) => {
    setContentItems(contentItems.map(item => {
      if (item.id === id) {
        return { ...item, description: newComment };
      }
      return item;
    }));
  };

  return (
    <div className="dashboard">
      <div className="left-sidebar">
        <h1>Journalist</h1>
        <button onClick={toggleDropdown} className="dropdown-button">
          New Entry
        </button>
        {showDropdown && (
          <div className="dropdown-content">
            <div className="dropdown-item">Video Journal</div>
            <div className="dropdown-item">Image Journal</div>
            <div className="dropdown-item">Text Journal</div>
          </div>
        )}
        <div className="journal-entry">
          <p>Mar 10th</p>
          <p>Reflect on today's day. Today was a busy day at work...</p>
        </div>
      </div>
      <div className="middle-placeholder">
        {contentItems.map(item => (
          <ContentCard 
            key={item.id} 
            {...item} 
            onUpdate={handleUpdateDescription}
          />
        ))}
      </div>
      <div className="right-sidebar">
        <h2>friend’s</h2>
        <input type="email" placeholder="Enter friend’s email" />
      </div>
    </div>
  );
};

export default Dashboard;