import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css";
import { Link } from "react-router-dom";
import wolf from "./assets/wolf.jpg";

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
      const reader = new FileReader();
      reader.onload = (e) => {""
        const base64String = e.target.result;
        setProfile((prevState) => ({
          ...prevState,
          photo: base64String,
        }));
        localStorage.setItem('profilePhoto', base64String); // Store the image as Base64 in local storage
      };
      reader.readAsDataURL(file);
    }
  };

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(
          "/backend/setting/retrieve-profile.php",
          {}, // Since we're using a Bearer token, no need for a body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Profile data retrieved!", response.data);
          // Map the snake_case properties from the backend to camelCase for the state
          const mappedData = {
            firstName: response.data.first_name || "",
            lastName: response.data.last_name || "",
            address: response.data.address || "",
            city: response.data.city || "",
            state: response.data.state || "",
            contactNumber: response.data.contact_number || "", // Assuming your backend sends this as 'contact_number'
          };
          setProfile((prevState) => ({
            ...prevState,
            ...mappedData,
          }));
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

    console.log(localStorage.getItem("token"));
    axios
      .post(
        "/backend/setting/edit-profile.php",
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Profile updated!", response.data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
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
              <Link to="/journal">Home</Link>
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
            {/* Existing menu items */}
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
      
        {profile.photo && (
    <div className="profile-photo-preview">
      <img src={profile.photo} alt="Profile" />
    </div>
  )}
        <div className="form-group">
            <label htmlFor="photo">Profile Photo</label>
            <input 
              type="file"
              id="photo"
              name="photo"
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
