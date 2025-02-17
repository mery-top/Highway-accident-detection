import React from 'react'
import Map from '../components/Maps'
import '../styles/photo.css';
import '../styles/navbar2.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Photos() {
  const [userLocation, setUserLocation] = useState({ latitude: 51.505, longitude: -0.09 });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);
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
      <Map latitude={userLocation.latitude} longitude={userLocation.longitude} />
      </div> 
      
    </div>
  )
}

export default Photos;
