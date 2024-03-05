import React, { useState, useEffect } from "react";
import axios from "axios";
import "./About.css";
import { Link } from "react-router-dom";
//import { ReactComponent as HomeIcon } from './home-icon.svg';

const About = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <div className="menu">
        <div className="menu-item"><Link to='/journal'>Home</Link></div>
          <div className="menu-item"><Link to='/edit-profile'>Edit Profile</Link></div>
          <div className="menu-item"><Link to='/security-page'>Security</Link></div>
          <div className="menu-item active"><Link to='/about'>About</Link></div>
        </div>
      </div>
      <div className="content">
        <div className="header">
          <h1 className="title">ABOUT</h1>
          <div className="role">Journalist</div>
        </div>
        <blockquote className="quote">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          <cite className="author">— CSE 442 Project</cite>
        </blockquote>
      </div>
    </div>
  );
};

export default About;