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
  const navigateToFriendProfile = (friendId) => {
    navigate(`/friend-profile/${friendId}`); // Adjust the path as needed
  };
  // const handleAcceptFriendRequest = async (requestID) => {
  //   try {
  //     const request = pendingRequests.find(req => req.id === requestID);
  //     if (!request) {
  //       throw new Error('Request not found.');
  //     }
  
  //     const response = await axios.post('/backend/friends/request.php', 
  //       JSON.stringify({
  //         action: 'accept',
  //         request_id: requestID
  //       }), 
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${localStorage.getItem("token")}`
  //         },
  //       }
  //     );
  
  //     if (response.data.message === "Friend request accepted successfully") {
  //       // Remove from pending and add to friends list
  //       setPendingRequests(prev => prev.filter(req => req.id !== requestID));
  //       setFriendsList(prev => [...prev, { id: request.id, name: request.email }]);
  //       await fetchFriendsList(); // Refresh the friends list
  //     } else {
  //       alert(response.data.error || "Failed to accept friend request.");
  //     }
  //   } catch (error) {
  //     console.error("Error accepting friend request:", error);
  //     alert("An error occurred while accepting the friend request.");
  //   }
  // };

  const handleAcceptFriendRequest = async (requestID) => {
    try {
      const request = pendingRequests.find(req => req.id === requestID);
      if (!request) {
        throw new Error('Request not found.');
      }
  
      // Optimistically update the UI
      setPendingRequests(prev => prev.filter(req => req.id !== requestID));
      setFriendsList(prev => [...prev, { id: request.id, name: request.email }]);
  
      // Send the accept request to the backend
      const response = await axios.post('/backend/friends/request.php', 
        JSON.stringify({
          action: 'accept',
          request_id: requestID
        }), 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
  
      if (response.data.message !== "Friend request accepted successfully") {
        // If not successful, revert the optimistic update
        setFriendsList(prev => prev.filter(friend => friend.id !== request.id));
        setPendingRequests(prev => [request, ...prev]);
        alert(response.data.error || "Failed to accept friend request.");
      } else {
        // Refresh the friends list from the backend
        await fetchFriendsList();
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("An error occurred while accepting the friend request.");
      // Revert state updates if an error occurs
      setFriendsList(prev => prev.filter(friend => friend.id !== request.id));
      setPendingRequests(prev => [request, ...prev]);
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

  
  // Function to fetch incoming friend requests
  // const fetchIncomingRequests = async () => {
  //   try {
  //     const response = await axios.get('/backend/friends/incoming_pending.php', {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });
  //     if (response.data && response.data.length > 0) {
  //       // Combine the new incoming requests with the existing ones without duplicates
  //       setPendingFriends(prev => {
  //         // Create a map of email to easily check for duplicates
  //         const existingEmails = new Set(prev.map(req => req.email));
  //         // Filter out duplicates and then concatenate with the existing list
  //         const newRequests = response.data.filter(req => !existingEmails.has(req.email));
  //         return [...prev, ...newRequests];
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching incoming friend requests:', error);
  //   }
  // };

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
    // Start polling for incoming friend requests
    fetchFriendsList();
    const interval = setInterval(fetchIncomingRequests, 5000); // Adjust the interval as needed

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
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
          {friendsList.map((friend) => (
            <div key={friend.id} className="friend-name">
              {friend.name}
              {/* Button to navigate to the friend's profile */}
              <button onClick={() => navigateToFriendProfile(friend.id)} className="view-profile-button">
                View Profile
              </button>
            </div>
          ))}
        </div>
        <div className="friends-list-container">
  <h4>Pending Requests</h4>
  {pendingRequests.map((request, index) => (
    <div key={index} className="pending-request">
      {request.email} ({request.status})
      <button onClick={() => handleAcceptFriendRequest(request.id)} className="accept-button">Yes</button>
      <button onClick={() => handleDeclineFriendRequest(request.id)} className="decline-button">No</button>
    </div>
  ))}
</div>
      </div>
    </div>
  );
};

export default Friend;
