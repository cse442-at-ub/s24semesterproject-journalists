import React, { useState } from 'react';
import axios from 'axios';
import './EditProfile.css'; // Ensure this path matches your file structure

function EditProfile() {
  // Initialize state for each input field in the user's profile
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    contactNumber: '',
    city: '',
    state: '',
  });

  // State to manage the visibility of the sidebar, initially hidden
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Toggle the visibility of the sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Update profile state as the user types in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Post request to save profile data
    axios.post('/api/profile', profile)
      .then(response => {
        console.log('Profile updated!', response.data);
        // Implement success feedback (e.g., a success message)
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        // Implement error feedback (e.g., an error message)
      });
  };

  return (
    <div className="profile-container">
      {/* Toggle button for the sidebar */}
      <button className="menu-button" onClick={toggleSidebar}>Menu</button>

      {/* Sidebar navigation, visibility toggled by state */}
      <aside className={`sidebar ${isSidebarVisible ? 'open' : ''}`}>
        <nav>
          <ul>
            <li><a href="/journal">Home</a></li>
            <li><a href="/edit-profile">Edit Profile</a></li>
            <li><a href="/security-page">Security</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </aside>

      <main className="profile-content">
        <header>
          <h1>Edit Profile —</h1>
          <span className="role">Journalist</span>
        </header>
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Form fields for editing the profile */}
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
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
            <button type="button" className="cancel-button">Cancel</button>
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProfile;