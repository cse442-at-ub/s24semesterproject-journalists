import React, { useState } from "react";
import "./JournalPage.css";
import monaLisaImage from "./assets/mona_lisa.jpeg"; // Adjust the import path as needed
import selfie_girl from "./assets/girl_pics_442.jpeg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";


// ContentCard component
const ContentCard = ({ id, type, content, description, onUpdate }) => {
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  const renderMedia = () => {
    switch (type) {
      case "image":
        return <img src={content} alt="user-post" />;
      case "video":
        return (
          <iframe
            src={content}
            frameBorder="0"
            allowFullScreen
            title="video"
          ></iframe>
        );
      case "text":
      default:
        return <p>{content}</p>;
    }
  };

  const [likes, setLikes] = useState(0);
  const [likers, setLikers] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setHasLiked(!hasLiked); // Toggle the like state
    if (hasLiked) {
      // If the post is already liked, unlike it
      setLikes(likes - 1);
      setLikers(likers.filter((liker) => liker !== "currentUser")); // Update likers list
    } else {
      // If the post is not liked, like it
      setLikes(likes + 1);
      setLikers([...likers, "currentUser"]); // Update likers list
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentButtonClick = () => {
    onUpdate(id, comment);
    setComment("");
  };

  const showLikers = () => {
    // Logic to display the list of likers, e.g., open a modal or tooltip
    // This could be a state change that triggers a modal to open
    console.log(likers); // Placeholder to show likers
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
        <div className="like-section">
          <button onClick={toggleLike} className="like-button">
            {hasLiked ? '❤️' : '🤍'}
          </button>
          <span className="likes-count" onClick={showLikers}>
            {likes} likes
          </span>
        </div>
      </div>
    </div>
  );
};

// Dashboard component
const Friend = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // State to hold search results
  const [friendsList, setFriendsList] = useState([
    { id: 1, name: "Jake Gothem" },
    { id: 2, name: "Max Gothem" },
  ]);
  const [userCity, setUserCity] = useState("New York");
  const [contentItems, setContentItems] = useState([
    {
      id: 2,
      type: "image",
      content: selfie_girl,
      description:
        "Remember that sorting can significantly affect performance.",
    },
    {
      id: 2,
      type: "image",
      content: monaLisaImage,
      description: "Image posted on Mar 11th",
    },
    {
      id: 1,
      type: "text",
      content: "This is a text post.",
      description: "Reflect on today’s day. Today was a busy day at work...",
    },
    {
      id: 3,
      type: "video",
      content: "https://www.youtube.com/embed/ehJ6oQHSkCk",
      description: "Video posted on Mar 11th",
    },
  ]);

  const handleSearchFriends = async () => {
    if (!friendEmail) {
      alert("Please enter an email to search.");
      return;
    }

    try {
      const response = await axios.get(
        `/backend/friends/search.php?query=${friendEmail}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the authorization header
          },
        }
      );
      setSearchResults(response.data); // Update the state with the search results
    } catch (error) {
      console.error("Error searching for friends:", error);
      alert("Failed to search for friends.");
    }
  };

  const history = () => {
    navigate("/journal");
  };
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [isAddFriendDisabled, setIsAddFriendDisabled] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateDescription = (id, newComment) => {
    setContentItems(
      contentItems.map((item) => {
        if (item.id === id) {
          return { ...item, description: newComment };
        }
        return item;
      })
    );
  };

  const handleFriendEmailChange = (e) => {
    setFriendEmail(e.target.value);
  };

  const handleAddFriend = () => {
    if (isValidEmail(friendEmail)) {
      setPendingFriends((prev) => [
        ...prev,
        { email: friendEmail, status: "Pending" },
      ]);
      setFriendEmail("");
      alert("Friend request sent successfully");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleBlockClick = () => {
    setIsBlocked(!isBlocked);
    setIsAddFriendDisabled(!isAddFriendDisabled);
  };

  const navigateToSearchFriends = () => {
    navigate("/public_profile", { state: { friendEmail: friendEmail } }); // Correctly use the state
  };

  const navigateToSettings = () => {
    navigate("/security-page"); // This will navigate to the SecurityPage component
  };

  return (
    <div className="dashboard">
      <div className="left-sidebar">
        <div className="settings-link-container">
          <div className="settings-text" onClick={navigateToSettings}>
            Settings
          </div>
        </div>
        <div className="journalist-header">
          <h1>Journalist</h1>
        </div>
        <div className="header-buttons">
          <Link to="/journal" className="header-button">
            New Journal Entry
          </Link>
        </div>
        <div className="journal-entry">
          <p>Mar 10th</p>
          <p>Reflect on today's day. Today was a busy day at work...</p>
        </div>
      </div>
      <div className="middle-placeholder">
        {contentItems.map((item) => (
          <ContentCard
            key={item.id}
            {...item}
            onUpdate={handleUpdateDescription}
          />
        ))}
      </div>
      <div className="right-sidebar">
        <div className="profile-section">
          <img
            className="profile-pic"
            src={selfie_girl}
            alt="Profile picture"
          />
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
        <button onClick={handleSearchFriends} className="add-friend-button">
          Search Friend
        </button>
        <div className="search-results-container">
          <h4>Search Results</h4>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div key={result.id} className="search-result">
                {result.email}
              </div>
            ))
          ) : (
            <p>No search results found.</p>
          )}
        </div>
        <div className="friends-list-container">
          <h4>Friends</h4>
          {friendsList.map((friend) => (
            <div key={friend.id} className="friend-name">
              {friend.name}
            </div>
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
