import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css"; // Ensure this path matches your file structure
import { Link } from "react-router-dom";

function EditProfile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    city: "",
    state: "",
    // Assuming you'll fetch and set this URL when the component loads or profile is fetched
    currentProfilePic: "", 

  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Append all text fields from the profile state
    Object.keys(profile).forEach(key => {
      if (key !== "currentProfilePic") { // Exclude the current profile picture URL
        formData.append(key, profile[key]);
      }
    });
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    axios.post(
      "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/setting/edit-profile.php",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Removed 'Content-Type': 'application/json' because it's a multipart form data now
        },
      }
    )
    .then((response) => {
      console.log("Profile updated!", response.data);
      // Handle success
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      // Handle error
    });
  };


  // This function will be called when the form is submitted
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Get the token from local storage or state management where it is stored
  //   console.log(localStorage.getItem("token"));
  //   axios
  //     .post(
  //       "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/setting/edit-profile.php",
  //       profile,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log("Profile updated!", response.data);
  //       // Handle the success case - maybe redirect or show a success message
  //     })
  //     .catch((error) => {
  //       console.error("Error updating profile:", error);
  //       // Handle the error case - maybe show an error message
  //     });
  // };

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
          <div className="form-group">
            <label htmlFor="profilePic">Profile Picture</label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              onChange={handleImageChange}
              accept="image/*"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Profile Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            )}
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
