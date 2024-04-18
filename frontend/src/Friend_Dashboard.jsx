import React, { useState, useEffect } from "react";
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

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentButtonClick = () => {
    onUpdate(id, comment);
    setComment("");
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
  const [searchResults, setSearchResults] = useState([]); // State to hold search results
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [userCity, setUserCity] = useState("New York");
  const [contentItems, setContentItems] = useState([
    {
      id: 1,
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
      id: 3,
      type: "text",
      content: "This is a text post.",
      description: "Reflect on today’s day. Today was a busy day at work...",
    },
    {
      id: 4,
      type: "video",
      content: "https://www.youtube.com/embed/ehJ6oQHSkCk",
      description: "Video posted on Mar 11th",
    },
  ]);
  const navigateToFriendProfile = (friendId) => {
    navigate(`/friend-profile/${friendId}`); // Adjust the path as needed
  };
  
  const handleAcceptFriendRequest = async (request) => {
    try {
      const response = await axios.post('/backend/friends/request.php', 
        JSON.stringify({
          action: 'accept',
          request_id: request.request_id, // Use the request_id from the request object
        }), 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (!response.data) {
        throw new Error('No data received from the server.');
      }
  
      if (typeof response.data.message === 'string' && response.data.message.includes("accepted friend request from")) {
        // Update pending requests
        setPendingRequests(prevRequests => prevRequests.filter(req => req.request_id !== request.request_id));
        alert(response.data.message); // Display the backend message to the user
        // Fetch the updated friends list
        fetchFriendsList();
      } else {
        // Handle errors
        throw new Error(response.data.error || "Failed to accept friend request.");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert(error.toString());
    }
  };
  
  


  // Function to decline a friend request
  const handleDeclineFriendRequest = async (requestID) => {
    try {
      const response = await axios.post('/backend/friends/request.php', 
        JSON.stringify({
          action: 'decline',
          request_id: requestID
        }), 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );

      if (response.data.message === "Friend request declined successfully") {
        // Remove declined request from pendingRequests
        setPendingRequests(prev => prev.filter(request => request.email !== email));
      } else {
        alert(response.data.error || "Failed to decline friend request.");
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
      alert("An error occurred while declining the friend request.");
    }
  };

  
 
  const fetchIncomingRequests = async () => {
    try {
      const response = await axios.get('/backend/friends/incoming_pending.php', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data); // Add this line to log the data
      if (response.data && response.data.length > 0) {
        setPendingRequests(response.data);
         // This now directly sets the state with the response
      }
    } catch (error) {
      console.error('Error fetching incoming friend requests:', error);
    }
  };


  useEffect(() => {
    // Function to fetch pending requests
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('/backend/friends/incoming_pending.php', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data) {
          setPendingRequests(response.data);
        }
      } catch (error) {
        console.error('Error fetching pending friend requests:', error);
      }
    };
    // Function to fetch friends list
    const fetchFriendsList = async () => {
      try {
        const response = await axios.get('/backend/friends/friends_list.php', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure the token is stored in localStorage
          },
        });
        if (response.data) {
          setFriendsList(response.data); // Update the friendsList state with the response
        }
      } catch (error) {
        console.error('Error fetching friends list:', error);
      }
    };

  // Set up the interval to refresh friends list every 5 seconds
  const friendsListIntervalId = setInterval(fetchFriendsList, 5000); // 5000 milliseconds is 5 seconds

  // Set up the interval to refresh pending requests every 15 seconds
  const pendingRequestsIntervalId = setInterval(fetchPendingRequests, 15000); // 15000 milliseconds is 15 seconds

  // Clear the intervals when the component is unmounted
  return () => {
    clearInterval(friendsListIntervalId);
    clearInterval(pendingRequestsIntervalId);
  };
}, []);


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

  // Function to fetch the list of friends
const fetchFriendsList = async () => {
  try {
    const response = await axios.get('/backend/friends/friend_list.php', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.data) {
      setFriendsList(response.data); // Update the friendsList state with the response
    }
  } catch (error) {
    console.error('Error fetching friends list:', error);
  }
};


  const handleAddFriend = async (email) => {
    try {
      // Send the request to the backend to add the friend
      const response = await axios.post(
        '/backend/friends/request.php',
        JSON.stringify({
          action: 'send',
          friend_email: email
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
      // Check if the backend process was successful
      if (response.data.message === "Friend request sent successfully") {
        alert("Friend request sent successfully.");
      } else {
        // Handle any other messages returned by the backend
        alert(response.data.error || "Failed to send friend request.");
      }
    } catch (error) {
      // Handle any errors in the request itself, such as network issues
      console.error("Error sending friend request:", error);
      alert("An error occurred while sending the friend request.");
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
        <div className="friends-list-container">
          <h4>Search Results</h4>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div key={result.id} className="friend-name">
                {result.email}
                <button onClick={() => handleAddFriend(result.email)} className="friend-button">Add Friend</button>
              </div>
            ))
          ) : (
            <p>No search results found.</p>
          )}
        </div>
        <div className="friends-list-container">
        <h4>Friends</h4>
        {friendsList.length > 0 ? (
          friendsList.map((friend) => (
            <div key={friend.id} className="friend-name">
              {friend.email}
              <button onClick={() => navigate(`/friend-profile/${friend.id}`)}>View Profile</button>
            </div>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </div>
        <div className="friends-list-container">
  <h4>Pending Requests</h4>
  {pendingRequests.map((request) => (
  <div key={request.request_id}>
    {request.email}
    <button onClick={() => handleAcceptFriendRequest(request)} className="accept-button">Accept</button>
      <button onClick={() => handleDeclineFriendRequest(request)} className="decline-button">Decline</button>
    </div>
 
))}

</div>
      </div>
    </div>
  );
};

export default Friend;
