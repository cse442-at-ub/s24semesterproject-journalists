import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import EditProfile from "./EditProfile.jsx";
import Journal from "./Journal_Dashboard";
import JournalImage from "./Jornal_image";
import JournalVideo from "./Journal_video";
import SignupPage from "./SignupPage.jsx";
import LoginPage from "./LoginPage.jsx";
import SecurityPage from "./SecurityPage.jsx";
import About from "./About.jsx";
import JournalHistory from "./JournalHistory.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/journal-image" element={<JournalImage />} />
        <Route path="/journal-video" element={<JournalVideo />} />
        <Route path="/signup-page" element={<SignupPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/security-page" element={<SecurityPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/journal-history" element={<JournalHistory />} />
        
      </Routes>
    </>
  );
};

export default App;
