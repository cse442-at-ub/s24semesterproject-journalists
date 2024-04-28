import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css";
import { Link } from "react-router-dom";
import wolf from "./assets/wolf.jpg";
import { useProfileImage } from './ProfileImageContext';

function EditProfile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contactNumber: "",
    city: "",
    state: "",
    photo: wolf,
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prevState) => ({
        ...prevState,
        photo: file, // Store the file object directly
      }));
    }
  };
  

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const { setProfileImageUrl } = useProfileImage();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post("https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/setting/retrieve-profile.php", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Profile data retrieved!", response.data);
          const profileData = response.data;
          const baseUrl = 'https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l'; // Dynamically get the base URL
          const imageFullPath = profileData.profile_image
            ? `${baseUrl}/${profileData.profile_image}`
            : wolf; // Default image if no profile image is provided
  
          setProfile({
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
            address: profileData.address || "",
            city: profileData.city || "",
            state: profileData.state || "",
            contactNumber: profileData.contact_number || "",
            photo: imageFullPath,
          });
          setProfileImageUrl(imageFullPath)
        })
        .catch((error) => {
          console.error("Error retrieving profile data:", error);
        });
    }
  }, []);
  

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);
    formData.append('address', profile.address);
    formData.append('city', profile.city);
    formData.append('state', profile.state);
    formData.append('contactNumber', profile.contactNumber);
    
    // Append the image file to formData with key 'image', which matches your backend and Postman setup
    if (profile.photo instanceof File) {
      formData.append('image', profile.photo); // Append the file object
    }
    
  
    axios
      .post("https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/setting/edit-profile.php", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Do not set Content-Type here, let the browser set it with the proper boundary for FormData
        },
      })
      .then((response) => {
        console.log("Profile updated!", response.data);
        // Handle success
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        // Handle error
      });
  };

  return (
    <div className="profile-container">
      <div className="hamburger-menu" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <aside className={`sidebar ${isSidebarVisible ? "open" : ""}`}>
        <nav>
          <ul>
            <li>
              <Link to="/Friend_Dashboard">Home</Link>
            </li>
            <li>
              <Link to="/edit-profile">Edit Profile</Link>
            </li>
            <li>
              <Link to="/security-page">Security</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            {/* ... other menu items ... */}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <Link to="/login-page" className="logout-button">
            Log Out
          </Link>
        </div>
      </aside>

      <main className="profile-content">
        <header>
          <h1>Edit Profile —</h1>
          <span className="role">Journalist</span>
        </header>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-photo-preview">
            <img src={profile.photo} alt="Profile" />
          </div>
          <div className="form-group">
            <label htmlFor="photo">Profile Photo</label>
            <input
              type="file"
              id="photo"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
         
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
            
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={profile.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={profile.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={profile.contactNumber}
              onChange={handleChange}
              placeholder="Enter your contact number"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProfile;
