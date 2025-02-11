import React from 'react'
import Map from '../components/Maps'
import '../styles/photo.css';
import '../styles/navbar2.css';
import { Link } from 'react-router-dom';

function Photos() {
  return (
    <div>
      {/* Use only navbar2 for the navigation */}
      <nav className="navbar2">
        <ul>
          <li><Link to="/home">🏠</Link></li>
          <li><Link to="/photos">📍</Link></li>
          <li><Link to="/settings">📞</Link></li>
          <li><Link to="/amb">🚑</Link></li>
          <li><Link to="/" onClick={() => localStorage.removeItem('token')}>↩</Link></li>
        </ul>
      </nav>
      
      {/* Map component */}
      <div className="map-cont">
        <Map />
      </div>
      
    </div>
  )
}

export default Photos;
