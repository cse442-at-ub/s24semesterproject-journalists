import React, { useState } from 'react';
import './JournalPage.css';
import monaLisaImage from './assets/mona_lisa.jpeg'; // Adjust the import path as needed
import selfie_girl from './assets/girl_pics_442.jpeg';
import { useNavigate } from "react-router-dom";
//import JournalHome from "./Journal_video";

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
  

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
const PublicProfile = () => {
   
  const [showDropdown, setShowDropdown] = useState(false);
  const [friendsList, setFriendsList] = useState([{ id: 1, name: 'Jake Gothem' }, { id: 2, name: 'Max Gothem' }]);
  const [userCity, setUserCity] = useState('New York');

  const [contentItems, setContentItems] = useState([
    { id: 2, type: 'image', content: selfie_girl, description: 'remember that sorting can significantly affect the performance of your query, especially with large datasets. Indexes on columns you frequently sort by can help improve performance.' },
    { id: 2, type: 'image', content: monaLisaImage, description: 'Image posted on Mar 11th' },
    { id: 1, type: 'text', content: 'This is a text post.', description: 'Reflect on today’s day. Today was a busy day at work...' },
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
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');

  const handleFriendEmailChange = (e) => {
    setFriendEmail(e.target.value);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
  const handleAddFriendClick = () => {
    alert('Friend request sent successfully');
  };    

  const [isAddFriendDisabled, setIsAddFriendDisabled] = useState(false);


  const [isBlocked, setIsBlocked] = useState(false);

  const handleBlockClick = () => {
    setIsBlocked(!isBlocked); // Toggle the blocked state
    setIsAddFriendDisabled(!isAddFriendDisabled); 
  };    

  const navigate = useNavigate();
  const home = () => {
    navigate("/Friend_Dashboard");
  };

  return (
    <div className="dashboard">
      <div className="left-sidebar">
        <div className="journalist-header">
          <h1>Journalist</h1>
          <button onClick={home} className="new-entry-button">Home</button>
        </div>
        {showDropdown && (
          <div className="dropdown-content">
            <div className="dropdown-item">Video Journal</div>
            <div className="dropdown-item">Image Journal</div>
            <div className="dropdown-item">Text Journal</div>
          </div>
        )}
        <div className="user-details">
          <h2 className="username-sidebar">Lauren Fox</h2>
          <p className="user-city">{userCity}</p>
        </div>
        {/* <div className="journal-entry">
          <p>Mar 10th</p>
          <p>Reflect on today's day. Today was a busy day at work...</p>
        </div> */}
        <div className="button-container">
            <div className="sidebar-buttons">
            <button 
            onClick={handleAddFriendClick} 
            className={`add-friend-button ${isAddFriendDisabled ? 'disabled' : ''}`}
            disabled={isAddFriendDisabled} // Disable the Add Friend button if blocked
          >
            Add Friend
          </button>
          <button onClick={handleBlockClick} className="block-button">
            {isBlocked ? 'Unblock' : 'Block'} {/* Toggle button text */}
          </button>
            </div> 
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
      {/* <div className="right-sidebar">
        <h2>friend’s</h2>
        <input type="email" placeholder="Enter friend’s email" />
      </div>
    </div> */}
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
            <button onClick={handleAddFriend} className="add-friend-button">Search Friend</button>
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

export default PublicProfile;