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
import Friend_Dashboard from "./Friend_Dashboard.jsx";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/public_profile" element={<PublicProfile />} />
        <Route path="/Friend_Dashboard" element={<Friend_Dashboard />} />
        <Route path="/journal-image" element={<JournalImage />} />
        <Route path="/journal-video" element={<JournalVideo />} />
        <Route path="/signup-page" element={<SignupPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/security-page" element={<SecurityPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/survey-page" element={<SurveySection />} />
      </Routes>
    </>
  );
};

export default App;
