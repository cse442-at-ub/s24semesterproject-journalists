import React, { useState } from 'react';
import axios from 'axios'; 
import './Journal_video.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import mona_lisa from "./assets/mona_lisa.jpeg"; // Ensure this path is correct
import wolf from "./assets/wolf.jpg"


const JournalVideo = () => {
  // useEffect(() => {
  //   // Convert the imported image URL to a blob, then to a file object
  //   fetch(wolf)
  //     .then(res => res.blob())
  //     .then(blob => {
  //       const file = new File([blob], "wolf.jpg", { type: "image/jpeg" });
  //       setImageFile(file);
  //     });
  // }, []);

  const [journalEntries, setJournalEntries] = useState([
    { date: 'Feb 1, 2024', content: 'Reflect on today’s day. Today was a busy day at work...' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [contentMode, setContentMode] = useState('video');
  const [newTitle, setNewTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { date: new Date().toLocaleDateString(), content: newMessage };
    setJournalEntries([...journalEntries, newEntry]);
    setNewMessage('');
    console.log("clicked")
  };


  // The function to save a new journal entry
  const saveEntry = async () => {
    // Assuming newTitle, newMessage, and imageFile are already defined in your component's state
    const imageUrl = wolf; // This should be the accessible URL path to the image
  
    const entryData = {
      title: newTitle,
      body: newMessage,
      image_path: imageUrl, // Assuming your backend can handle a direct URL string
    };
    try {
      // Make the POST request to your backend endpoint with form-data
      const response = await axios.post(
        'http://localhost/Journalist/backend/journal/create.php', // Replace with your actual endpoint
        entryData, // Use FormData for multipart/form-data type
        {
          headers: {
            // The content type header will be set automatically to multipart/form-data by axios when FormData is passed
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure you're getting the token correctly
          },
        }
      );
  
      // Check if the POST request was successful
      if (response.status === 201) {
        // If successful, process response data as needed, such as updating UI or state
        console.log('Journal entry created successfully:', response.data);
        // Optionally, reset the form state or update the UI here
        setNewTitle('');
        setNewMessage('');
        setImageFile(null);
      } else {
        // Handle any non-201 status codes here
        console.error('Failed to save the journal entry:', response);
      }
    } catch (error) {
      // Handle errors here
      console.error('Error while saving the journal entry:', error.response || error);
    }
  };

  const handleDropdownSelection = (mode) => {
    setContentMode(mode);
  };

  const journal = () => {
    navigate('/journal');
  };
  const journalImage = () => {
    navigate('/journal-image');
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]); // Set the image file when it's selected
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

// Replace this with the actual token retrieval logic
  //const token = 'c31182978424e2c008e463e7a0fb2214'; // This should be the actual token of the authenticated user
  
  const deleteJournalEntry = async (entryId) => {
    try {
      // const response = await axios.get({"/backend/journal/read.php"
      const response = await axios({
        method: 'delete',
        url: 'http://localhost/Journalist/backend/journal/delete.php',
        data: {
          entry_id: entryId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 200) {
        // Deletion was successful, remove the entry from state
        setJournalEntries((prevEntries) => 
          prevEntries.filter((entry) => entry.entry_id !== entryId)
        );
        console.log('Deletion successful:', response.data);
      } else {
        // Handle any non-200 status codes
        console.error('Failed to delete the entry:', response.data);
      }
    } catch (error) {
      // Handle errors, such as network problems or server being unreachable
      console.error('Error deleting the entry:', error.response);
    }
  };
  

  return (
    <div className="journal-dashboard">
      <div className="left-column">
        <div className="header">
        <h1> <Link to='/Friend_Dashboard'>Journalist</Link></h1>
        <div className="dropdown">
            <button className="button orange" onClick={toggleDropdown}>New Entry &#9662;</button>
            {showDropdown && (
            <div className={`dropdown-content${showDropdown ? ' show' : ''}`}>
            {/* Add new dropdown items for video and text journals */}
              <button className="dropdown-item" onClick={() => handleDropdownSelection('text')}>Text Journal</button>
              <button className="dropdown-item" onClick={() => handleDropdownSelection('video')}>Video Journal</button>
              <button className="dropdown-item" onClick={() => handleDropdownSelection('image')}>Image Journal</button>
            </div>
            )}
          </div>
        </div>
      <div className="entries">
          {journalEntries.map((entry, index) => (
            <div key={index} className="entry-container">
              <button className="entry" onClick={() => {/* handle select entry if needed */}}>
                <p className="entry-date">{entry.date}</p>
                <p className="entry-content">{entry.content}</p>
              </button>
              {/* Delete button for each entry */}
              <button className="button delete-button" onClick={() => deleteJournalEntry(index)}>
                Delete
              </button>
            </div>
            ))}
          </div>
      </div>
      <div className="right-column">
        <p className="date">Date: {new Date().toLocaleDateString()}</p>
        <div className="content-area">
          {contentMode === 'text' && (
            <div className="text-content">
              <h2>How was your day?</h2>
            </div>
          )}
          {contentMode === 'video' && (
            <div className="video-container">
              <iframe
                className="journal-video"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>  
            </div>
          )}
          {contentMode === 'image' && (
            <div className="video-container">
            <img
              className="journal-image"
              src= {wolf}
              alt="Journal Entry"
            />
          </div>
          )}
        </div>
        <textarea
          className="textarea-journal"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Reflect on today's day..."
        />
        <button className="button orange save-button" onClick={saveEntry}>Save</button>
      </div>
    </div>
  );
};

export default JournalVideo;