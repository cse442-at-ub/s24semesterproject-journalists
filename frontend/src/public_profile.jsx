import React, { useState } from 'react';
import './JournalPage.css';
import monaLisaImage from './assets/mona_lisa.jpeg';
import selfie_girl from './assets/girl_pics_442.jpeg';
import { useNavigate, useLocation } from "react-router-dom"; // Correctly import both useNavigate and useLocation together

// ContentCard component
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
const PublicProfile = () => {
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
  const navigateToSearchFriends = () => {
    navigate("/public_profile"); // Adjust the path as needed
  };

  // Navigate to friend's profile
  const location = useLocation(); // Access navigation state
  const emailFromSearch = location.state?.friendEmail; 

  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');
  const [isAddFriendDisabled, setIsAddFriendDisabled] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const [bio, setBio] = useState('Avid photographer and writer. Exploring the world through the lens of my camera.');
  const [websiteLink, setWebsiteLink] = useState('https://www.userwebsite.com');
  const [socialLinks, setSocialLinks] = useState({
    linkedin: 'https://www.linkedin.com/in/user',
    twitter: 'https://twitter.com/user',
    instagram: 'https://www.instagram.com/user',
  });
  const [joinDate, setJoinDate] = useState('March 2020');
  const [numberOfPosts, setNumberOfPosts] = useState(47);

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

  // const handleAddFriend = () => {
  //   const newFriend = emailFromSearch;
  //   if (isValidEmail(newFriend)) {
  //     setPendingFriends(prev => [...prev, { email: friendEmail, status: 'Pending' }]);
  //     setFriendEmail('');
  //     alert('Friend request sent successfully');
  //     setPendingFriends([...pendingFriends, { email: newFriend, status: 'Pending' }]);
  //   } else {
  //     alert('Please enter a valid email address.');
  //   }
  // };

  const handleAddFriend = () => {
    const newFriend = emailFromSearch; // This seems to be the email from a search field, not the input
    // If you meant to use the input field, you should use friendEmail instead of emailFromSearch.
    
    // Just check if there is some input, not whether it's a valid email
    if (newFriend) {
      setPendingFriends(prev => [...prev, { email: newFriend, status: 'Pending' }]);
      alert('Friend request sent successfully');
    } else {
      alert('Please enter an email address.');
    }
  
    // After adding a friend, you may want to clear the input field.
    // If you are using friendEmail from the input field, uncomment the line below.
    // setFriendEmail(''); 
  };
  const handleBlockClick = () => {
    setIsBlocked(!isBlocked);
    setIsAddFriendDisabled(!isAddFriendDisabled);
  };

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
  <h2 className="username-sidebar">{emailFromSearch || userCity}</h2> {/* Display the email or fallback to userCity */}
</div>
        <div className="button-container">
          <div className="sidebar-buttons">
            <button onClick={handleAddFriend} className={`add-friend-button ${isAddFriendDisabled ? 'disabled' : ''}`} disabled={isAddFriendDisabled}>
              Add Friend
            </button>
            <button onClick={handleBlockClick} className="block-button">
              {isBlocked ? 'Unblock' : 'Block'}
            </button>
          </div> 
        </div>
        <div className="user-bio">
          <p>{bio}</p>
        </div>
        <div className="user-website">
          <a href={websiteLink} target="_blank" rel="noopener noreferrer">Personal Website</a>
        </div>
        <div className="social-links">
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div className="user-info">
          <p>Joined: {joinDate}</p>
          <p>Posts: {numberOfPosts}</p>
        </div>
        
      </div>
      <div className="middle-placeholder">
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

export default PublicProfile;