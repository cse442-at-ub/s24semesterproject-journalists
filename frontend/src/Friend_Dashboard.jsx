import React, { useState } from 'react';
import './JournalPage.css'; // The CSS file will contain all the styling for responsiveness

// Here's the ContentCard component as an example, 
// you'd typically define it in its own file and import it.
const ContentCard = ({ type, content, description }) => {
  const renderMedia = () => {
    switch (type) {
      case 'image':
        return <img src={content} alt="user-post" />;
      case 'video':
        return <video src={content} controls />;
      case 'text':
      default:
        return <p>{content}</p>;
    }
  };

  return (
    <div className="content-card">
      <div className="media">{renderMedia()}</div>
      <div className="description">
        <p>{description}</p>
      </div>
      <button className="comment-button">Comment</button>
    </div>
  );
};

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Sample data for content cards
  const contentItems = [
    { id: 1, type: 'text', content: 'This is a text post.', description: 'Posted on Mar 10th' },
    { id: 2, type: 'image', content: 'path_to_image.jpg', description: 'Image posted on Mar 11th' },
    // Add more content items as needed
  ];

  return (
    <div className="dashboard">
      <div className="left-sidebar">
        <h1>Journalist</h1>
        <div className="dropdown">
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
        </div>
        <div className="journal-entry">
          <p>Mar 10th</p>
          <p>Reflect on today's day. Today was a busy day at work...</p>
        </div>
        {/* Here we map over the content items and render a ContentCard for each one */}
      </div>
      <div className="middle-placeholder">
      {contentItems.map(item => (
          <ContentCard key={item.id} type={item.type} content={item.content} description={item.description} />
        ))}      </div>
      <div className="right-sidebar">
        <h2>friend’s</h2>
        <input type="email" placeholder="Enter friend’s email" />
        {/* Additional elements for the right sidebar */}
      </div>
    </div>
  );
};

export default Dashboard;