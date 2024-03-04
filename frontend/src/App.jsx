import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EditProfile from './EditProfile.jsx';
import Journal from "./Journal_Dashboard";
import JournalImage from "./Jornal_image";
import JournalVideo from "./Journal_video";
<<<<<<< HEAD
import About from "./About";

=======
import SignupPage from './SignupPage.jsx';
import LoginPage from './LoginPage.jsx';
import Journal_Dashboard from './Journal_Dashboard';
import SecurityPage from './SecurityPage.jsx';
import About from './About.jsx';
>>>>>>> 45d3608f4d319ff24b5afaa74a693bb2a9678b6b

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/journal-image" element={<JournalImage />} />
        <Route path="/journal-video" element={<JournalVideo />} />
<<<<<<< HEAD
        <Route path="/about" element={<About />} />

=======
        <Route path="/signup-page" element={<SignupPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/security-page" element={<SecurityPage />} />
        <Route path="/about" element={<About />} />
>>>>>>> 45d3608f4d319ff24b5afaa74a693bb2a9678b6b
      </Routes>
    </Router>
  );
};

export default App;