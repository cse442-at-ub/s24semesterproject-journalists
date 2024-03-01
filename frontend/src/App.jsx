import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EditProfile from './EditProfile.jsx';
import Journal from "./Journal_Dashboard";
import JournalImage from "./Jornal_image";
import JournalVideo from "./Journal_video";
import SignupPage from './SignupPage.jsx';
import LoginPage from './LoginPage.jsx';
import Journal_Dashboard from './Journal_Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/journal-image" element={<JournalImage />} />
        <Route path="/journal-video" element={<JournalVideo />} />
        <Route path="/signup-page" element={<SignupPage />} />
        <Route path="/login-page" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;