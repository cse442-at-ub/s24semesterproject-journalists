import React, { useState, useEffect } from "react";
import "./JournalPage.css";
import monaLisaImage from "./assets/mona_lisa.jpeg"; // Adjust the import path as needed
import selfie_girl from "./assets/girl_pics_442.jpeg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

// // ContentCard component
// const ContentCard = ({ id, type, content, description, onUpdate, fetchComments }) => {
//   const [comments, setComments] = useState([]); // State to store comments
//   const [comment, setComment] = useState(""); // State to store a new comment

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAndSetComments = async () => {
//       const fetchedComments = await fetchComments(id);
//       setComments(fetchedComments);
//     };

//     fetchAndSetComments();
//   }, [id, fetchComments]);

//   const renderMedia = () => {
//     switch (type) {
//       case "image":
//         return (
//           <img src={content} alt="user-post"/>
//         );
//       case "text":
//       default:
//         return <p>{content}</p>;
//     }
//   };

//   const renderComments = () => {
//     return comments.map((comment, index) => (
//       <p key={index}>{comment.text}</p> // Assume your comment object has a 'text' field
//     ));
//   };

//   const handleCommentChange = (e) => {
//     setComment(e.target.value);
//   };

//   const handleCommentButtonClick = () => {
//     onUpdate(id, comment);
//     setComment("");
//   };

//   return (
//     <div className="content-card">
//       <div className="media">{renderMedia()}</div>
//       <div className="description">
//         <p>{description}</p>
//         <div className="comments-section">
//         {renderComments()}
//           <div className="comment-input-container">
//             <input
//               type="text"
//               value={comment}
//               onChange={handleCommentChange}
//               placeholder="Leave a comment..."
//               className="comment-input"
//             />
//             <button
//             onClick={() => {
//               onUpdate(id, comment);
//               setComment("");
//             }}
//             className="comment-button"
//           >
//             Comment
//           </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Dashboard component
const Friend = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // State to hold search results
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [userCity, setUserCity] = useState("New York");
  const [journalEntries, setJournalEntries] = useState([]);


 

  const ContentCard = ({ id, title, body, created_at, image_path, onUpdate }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
  
    // Fetch comments using the journal entry ID
    const fetchComments = async () => {
      if (!id) {
        console.error("Journal entry ID is undefined.");  // Ensure this error is not triggered
        return;
      }
      try {
        const response = await axios.get(`/backend/friends/get_comments.php?journal_entry_id=${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data && Array.isArray(response.data.comments)) {
          setComments(response.data.comments);  // Update the comments state
        } else {
          console.error('No comments found or wrong data format', response.data);
          setComments([]);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      }
    };
  
    useEffect(() => {
      fetchComments();  // Fetch comments whenever the id changes
    }, [id]);
  
    const handleCommentChange = (e) => setCommentText(e.target.value);
  
    const handleCommentButtonClick = async () => {
      if (commentText.trim() !== "") {
        await onUpdate(id, commentText);
        setCommentText("");  // Clear the input after submitting
        fetchComments();  // Optionally re-fetch comments if needed
      } else {
        alert("Comment cannot be empty!");
      }
    };
  
    const renderComments = () => comments.map((comment) => (
      <div key={comment.comment_id}>
        <strong>User {comment.user_id}:</strong>
        <p>{comment.comment}</p>
        <span>{new Date(comment.created_at).toLocaleString()}</span> 
      </div>
    ));
  
    return (
      <div className="content-card">
        {image_path && <div className="media"><img src={image_path} alt="Entry" /></div>}
        <div className="content-details">
          <h3>{title}</h3>
          <p>{body}</p>
          <p className="date">Posted on: {new Date(created_at).toLocaleString()}</p>
        </div>
        <div className="comments-section">
          {renderComments()}
          <div className="comment-input-container">
            <input
              type="text"
              value={commentText}
              onChange={handleCommentChange}
              placeholder="Leave a comment..."
              className="comment-input"
            />
            <button onClick={handleCommentButtonClick} className="comment-button">
              Comment
            </button>
          </div>
        </div>
      </div>
    );
  };
  const fetchJournalEntries = async () => {
    try {
      const response = await axios.get('/backend/friends/retrieve_entries.php', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setJournalEntries(response.data.journalEntries);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };
  const navigateToFriendProfile = (friendId) => {
    navigate(`/friend-profile/${friendId}`); // Adjust the path as needed
  };

  
  


  // Function to decline a friend request
  const handleDeclineFriendRequest = async (request) => {
    try {
      const response = await axios.post('/backend/friends/request.php', 
        JSON.stringify({
          action: 'decline',
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
  
      if (typeof response.data.message === 'string' && response.data.message.includes("declined friend request from")) {
        // Update pending requests
        setPendingRequests(prevRequests => prevRequests.filter(req => req.request_id !== request.request_id));
        alert(response.data.message); // Display the backend message to the user
      } else {
        // Handle errors
        throw new Error(response.data.error || "Failed to decline friend request.");
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
      alert(error.toString());
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


      // Function to fetch pending requests

      const fetchPendingRequests = async () => {
        try {
          const response = await axios.get('/backend/friends/incoming_pending.php', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (JSON.stringify(response.data) !== JSON.stringify(pendingRequests)) {
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

  useEffect(() => {

    fetchFriendsList();
  // Set up the interval to refresh friends list every 5 seconds
  //const friendsListIntervalId = setInterval(fetchFriendsList, 1500); // 5000 milliseconds is 5 seconds

  // Set up the interval to refresh pending requests every 15 seconds
  const pendingRequestsIntervalId = setInterval(fetchPendingRequests, 10000); // Change to 10 seconds
  // 15000 milliseconds is 15 seconds

  // Clear the intervals when the component is unmounted
  return () => {
    //clearInterval(friendsListIntervalId);
    clearInterval(pendingRequestsIntervalId);
  };
}, []);



  const userEmail = localStorage.getItem("email"); 
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
  const [isProfileSelected, setIsProfileSelected] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    setIsProfileSelected(true); // Set to true when a friend's profile is selected
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

//   // Function to fetch the list of friends
// const fetchFriendsList = async () => {
//   try {
//     const response = await axios.get('/backend/friends/friend_list.php', {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     });
//     if (response.data) {
//       setFriendsList(response.data); // Update the friendsList state with the response
//     }
//   } catch (error) {
//     console.error('Error fetching friends list:', error);
//   }
// };

  
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
  
  // Function to fetch and display a friend's journal entries
const viewFriendProfile = async (friendId) => {
  // Assuming you have a function to get the current user's token
  const token = localStorage.getItem('token'); 

  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const response = await axios.get(`/backend/friends/retrieve_entries.php?user_id=${friendId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (response.data.journalEntries) {
      setJournalEntries(response.data.journalEntries);
      setIsProfileSelected(true); // Set this to true to indicate that journal entries are being shown
    } else {
      // Handle if there are no journal entries
      setJournalEntries([]);
      alert('No journal entries found for this user.');
    }
  } catch (error) {
    console.error('Error fetching friend\'s journal entries:', error);
    // Handle error, maybe set state to show user feedback
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
    navigate("/edit-profile"); // This will navigate to the SecurityPage component
  };

  const addComment = async (journalEntryId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        return;
      }
  
      // Preparing the data in the same format as the handleAcceptFriendRequest function
      const data = JSON.stringify({
        journal_entry_id: journalEntryId,
        comment: commentText
      });
  
      // Sending the request
      const response = await axios.post('/backend/friends/add_comment.php', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Handling the response
      if (!response.data) {
        throw new Error('No data received from the server.');
      }
  
      // Check for a successful message
      if (response.data.message === "Comment added successfully") {
        console.log("Comment added successfully", response.data);
        // Optionally, refresh the comments list here
        // fetchComments(journalEntryId);
      } else {
        // If the server responds with an error message
        throw new Error(response.data.error || "Failed to add comment.");
      }
    } catch (error) {
      // Log full error response for debugging
      console.error("Failed to add comment:", error.response || error);
      alert("An error occurred while adding the comment: " + (error.response ? error.response.data.error : error.message));
    }
  };

// const fetchComments = async (journalEntryId) => {
//   try {
//     const response = await axios.get(`/backend/friends/get_comments.php?journal_entry_id=${journalEntryId}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//     });
//     return response.data.comments; // Return the comments from the response
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     alert('Failed to fetch comments.');
//     return []; // Return an empty array in case of error
//   }
// };

  return (
    <div className="dashboard">
      <div className="left-sidebar">
        <div className="settings-link-container">
        <div className="settings-link-container">
      <div className="settings-text" onClick={navigateToSettings}>⚙️</div>
    </div>
        </div>
        <div className="journalist-header">
          <h1>Journalist</h1>
          <Link to="/journal" className="header-button">
            New Journal Entry
          </Link>
        </div>
        <div className="journal-entry">
          <p>Mar 10th</p>
          <p>Reflect on today's day. Today was a busy day at work...</p>
        </div>
      </div>
      {/* <div className="middle-placeholder">
      {isProfileSelected && journalEntries.length > 0 ? (
        journalEntries.map((entry) => (
          <ContentCard
            key={entry.id}
            title={entry.title}
            body={entry.body}
            image_path={entry.image_path}
            created_at={entry.created_at}
          />
        ))
      ) : (
        <p>Please click on a friend's profile to view their journals.</p>
      )}
    </div> */}

<div className="middle-placeholder">
  {isProfileSelected && journalEntries.length > 0 ? (
    journalEntries.map((entry) => (
      <ContentCard
        key={entry.id}
        id={entry.id}
        title={entry.title}
        body={entry.body}
        image_path={entry.image_path ? entry.image_path : null}
        created_at={entry.created_at}
        onUpdate={(id, comment) => addComment(id, comment)}
        // fetchComments={() => fetchComments(entry.id)}
      />
    ))
  ) : (
    <p className="centered-text">Please click on a friend's profile to view their journals.</p>
  )}
</div>
      <div className="right-sidebar">
        <div className="profile-section">
          <img
            className="profile-pic"
            src={selfie_girl}
            alt="Profile picture"
          />
          <h2 className="username">{userEmail}</h2>
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
              <button onClick={() => viewFriendProfile(friend.id)} className="dropdown-button2">View Profile</button>
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