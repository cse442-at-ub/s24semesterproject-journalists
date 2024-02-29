import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EditProfile from './EditProfile.jsx';
import Journal from "./Journal_Dashboard";
import JournalImage from "./Jornal_image";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Journal />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/journal-image" element={<JournalImage />} />
      </Routes>
    </Router>
  );
};

export default App;