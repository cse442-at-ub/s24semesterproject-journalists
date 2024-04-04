import React, { useState } from 'react';
import './JournalPage.css';
import monaLisaImage from './assets/mona_lisa.jpeg'; // Adjust the import path as needed
import selfie_girl from './assets/girl_pics_442.jpeg';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


// ContentCard component
const ContentCard = ({ id, type, content, description, onUpdate }) => {
  const [comment, setComment] = useState('');

  const navigate = useNavigate();


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
    onUpdate(id, comment);
    setComment('');
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

// Dashboard component
const Friend = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [friendsList, setFriendsList] = useState([{ id: 1, name: 'Jake Gothem' }, { id: 2, name: 'Max Gothem' }]);
  const [userCity, setUserCity] = useState('New York');
  const [contentItems, setContentItems] = useState([
    { id: 2, type: 'image', content: selfie_girl, description: 'Remember that sorting can significantly affect performance.' },
    { id: 2, type: 'image', content: monaLisaImage, description: 'Image posted on Mar 11th' },
    { id: 1, type: 'text', content: 'This is a text post.', description: 'Reflect on today’s day. Today was a busy day at work...' },
    { id: 3, type: 'video', content: 'https://www.youtube.com/embed/ehJ6oQHSkCk', description: 'Video posted on Mar 11th' },
  ]);

  const history = () => {
    navigate("/journal-video");
  };
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');
  const [isAddFriendDisabled, setIsAddFriendDisabled] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateDescription = (id, newComment) => {
    setContentItems(contentItems.map(item => {
      if (item.id === id) {
        return { ...item, description: newComment };
      }
      return item;
    }));
  };

  const handleFriendEmailChange = (e) => {
    setFriendEmail(e.target.value);
  };

  const handleAddFriend = () => {
    if (isValidEmail(friendEmail)) {
      setPendingFriends(prev => [...prev, { email: friendEmail, status: 'Pending' }]);
      setFriendEmail('');
      alert('Friend request sent successfully');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  const handleBlockClick = () => {
    setIsBlocked(!isBlocked);
    setIsAddFriendDisabled(!isAddFriendDisabled);
  };

  const navigateToSearchFriends = () => {
    navigate("/public_profile", { state: { friendEmail: friendEmail } }); // Correctly use the state
  };
  return (
    <div className="dashboard">
      <div className="left-sidebar">
        {/* Existing left-sidebar content */}
        <div className="journalist-header">
          <h1>Journalist</h1>
        </div>
        <div className="header-buttons">
        
        <Link to="/journal-video" className="header-button">Journal History</Link>
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
        <input type="email" placeholder="Enter friend's email" value={friendEmail} onChange={handleFriendEmailChange} className="friend-email-input" />
        <button onClick={navigateToSearchFriends} className="add-friend-button">Search Friend</button>
        <div className="friends-list-container">
          <h4>Friends</h4>
          {friendsList.map(friend => (
            <div key={friend.id} className="friend-name">{friend.name}</div>
          ))}
        </div>
        <div className="friends-list-container">
          <h4>Pending Requests</h4>
          {pendingFriends.map((friend, index) => (
            <div key={index} className="pending-request">
              {friend.email} ({friend.status})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friend;