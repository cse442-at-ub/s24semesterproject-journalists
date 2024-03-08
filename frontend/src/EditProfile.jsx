import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css'; // Ensure this path matches your file structure

function EditProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    contactNumber: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    // Fetch the profile data from the backend when the component mounts
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(response.data); // Assume the data is in the correct format
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Handle the error appropriately
      }
    };

    fetchProfileData();
  }, []);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // This function will handle the change for every input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // This function will be called when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the token from local storage or state management where it is stored
    console.log(localStorage.getItem("token"));
    axios
      .post("/backend/setting/edit-profile.php", profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Profile updated!", response.data);
        // Handle the success case - maybe redirect or show a success message
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        // Handle the error case - maybe show an error message
      });
  };

  return (
    <div className="profile-container">
      <div className="hamburger-menu" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <aside className={`sidebar ${isSidebarVisible ? 'open' : ''}`}>
  <nav>
    <ul>
      <li><a href="/journal">Home</a></li>
      <li><a href="/edit-profile">Edit Profile</a></li>
      <li><a href="/security-page">Security</a></li>
      <li><a href="/about">About</a></li>
      {/* Existing menu items */}
    </ul>
  </nav>
  <div className="sidebar-footer">
    <a href="/login-page" className="logout-button">Log Out</a>
  </div>
</aside>
      <main className="profile-content">
        <header>
          <h1>Edit Profile —</h1>
          <span className="role">Journalist</span>
        </header>
        <form className="profile-form" onSubmit={handleSubmit}>
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
