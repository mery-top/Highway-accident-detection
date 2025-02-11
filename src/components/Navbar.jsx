// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';  // Make sure to create this CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/home">🏠</Link></li>
        <li><Link to="/photos">📍</Link></li>
        <li><Link to="/settings">📞</Link></li>
        <li><Link to="/amb">🚑</Link></li>
        <li><Link to="/" onClick={() => localStorage.removeItem('token')}>↩</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
