import React, { useState } from 'react';
import axios from 'axios';
import './EditProfile.css'; // Make sure this path is correct.

function EditProfile() {
  // Initialize state for each input field
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    contactNumber: '',
    city: '',
    state: '',
  });

  // This function will handle the change for every input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // This function will be called when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    // Make a post request to save the data
    axios.post('/api/profile', profile)
      .then(response => {
        console.log('Profile updated!', response.data);
        // Handle the success case - maybe redirect or show a success message
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        // Handle the error case - maybe show an error message
      });
  };

  return (
    <div className="profile-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>Edit profile</li>
            <li>Security</li>
            <li>About</li>
          </ul>
        </nav>
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
                placeholder="Enter your name"
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
                placeholder="Enter your Last Name"
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
              placeholder="Enter your Address"
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
              placeholder="Enter a valid phone number"
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