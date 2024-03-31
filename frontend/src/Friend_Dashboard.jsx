import React, { useState } from 'react';
import './JournalPage.css'; // Assuming your CSS file is named JournalPage.css
// Import images if used in your content cards or profile picture
import selfie_girl from './assets/girl_pics_442.jpeg';
import monaLisaImage from './assets/mona_lisa.jpeg';


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


// ContentCard component (assuming it's defined in the same file for simplicity)
const ContentCard = ({ id, type, content, description, onUpdate }) => {
  const [comment, setComment] = useState('');

  const renderMedia = () => {
    switch (type) {
      case 'image':
        return <img src={content} alt="user-post" />;
      case 'video':
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
    onUpdate(id, comment); // Sends the new comment up to update the content item's description
    setComment(''); // Reset comment input after submission
  };

  return (
    <div className="content-card">
      <div className="media">{renderMedia()}</div>
      <div className="description">
        <p>{description}</p>
        <div className="comment-input-container">
          <input
            type="text"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Leave a comment..."
            className="comment-input"
          />
        </div>
        <button onClick={handleCommentButtonClick} className="comment-button">
          Comment
        </button>
      </div>
    </div>
  );
};

// Dashboard component including left sidebar, middle content, and right sidebar for friends
const Dashboard = () => {
  const [contentItems, setContentItems] = useState([
    { id: 2, type: 'image', content: selfie_girl, description: 'A memorable day captured in a selfie.' },
    { id: 4, type: 'image', content: monaLisaImage, description: 'Replica of Mona Lisa.' },
    { id: 1, type: 'text', content: 'This is a text post.', description: 'Reflecting on a busy day at work...' },
    { id: 3, type: 'video', content: 'https://www.youtube.com/embed/ehJ6oQHSkCk', description: 'A fascinating video on art history.' },
  ]);

  const handleUpdateDescription = (id, newComment) => {
    setContentItems(contentItems.map(item => {
      if (item.id === id) {
        return { ...item, description: newComment };
      }
      return item;
    }));
  };

  // New states for managing friends
  const [friendsList, setFriendsList] = useState([
    { id: 1, name: 'Jake Gothem' },
    { id: 2, name: 'Max Gothem' },
  ]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');

  const handleFriendEmailChange = (e) => {
    setFriendEmail(e.target.value);
  };

  const handleAddFriend = () => {
    if (isValidEmail(friendEmail)) {
      // If the email is valid, add it to the pending friends list
      setPendingFriends(prev => [...prev, { email: friendEmail, status: 'Pending' }]);
      setFriendEmail(''); // Reset the input field
    } else {
      // If the email is not valid, alert the user
      alert('Please enter a valid email address.');
    }
  };

  return (
    <div className="dashboard">
      <div className="left-sidebar">
        {/* Existing left-sidebar content */}
        <div className="journalist-header">
          <h1>Journalist</h1>
        </div>
        <div className="header-buttons">
          <a href="/journal" className="header-button">Text Entry</a>
          <a href="/journal-image" className="header-button">Image Entry</a>
          <a href="/journal-video" className="header-button">Video Entry</a>
        </div>
        <div className="journal-entry">
          <p>Mar 10th</p>
          <p>Reflect on today's day. Today was a busy day at work...</p>
        </div>
      </div>
      <div className="middle-placeholder">
        {/* Map through your content items to display them */}
        {contentItems.map(item => (
          <ContentCard key={item.id} {...item} onUpdate={handleUpdateDescription} />
        ))}
      </div>
      <div className="right-sidebar">
        <div className="profile-section">
        <img className="profile-pic" src={selfie_girl} alt="Profile picture" />
        <h2 className="username">Lauren Fox</h2>
         </div>

            <h3 className="invite-text">Invite your friends</h3>
             <input
        type="email"
        placeholder="Enter friend's email"
        value={friendEmail}
        onChange={handleFriendEmailChange}
        className="friend-email-input"
          />
            <button onClick={handleAddFriend} className="add-friend-button">Add Friend</button>

          <div className="friends-list-container">
            <h4>Friends</h4>
            {friendsList.map(friend => (
              <div key={friend.id} className="friend-name">{friend.name}</div>
            ))}
          </div>

          <div className="friends-list-container">
          <h4>Pending Requests</h4>
         {pendingFriends.map((email, index) => (
      <div key={index} className="pending-request">{email} (Pending)</div>
      ))}
  </div>
</div>
    </div>
  );
};

export default Dashboard;