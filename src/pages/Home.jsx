import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/home.css';
function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Optionally reset any other session data

    // Redirect the user to the login page
    navigate("/");
  };

  return (
    <div>
      <h2>Patient Info</h2>
      <div className="home-container">
      <div className="flex-row">
        <div className="flex-box1">
          <h3>Heartbeat Rate</h3>
        </div>
        <div className="flex-box2">
        <h3>Location and Severity</h3>
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-box3"><h3>Body Temperature</h3></div>
        <div className="flex-box4"><h3>Accident Timing</h3></div>
      </div>
    </div>

    </div>
  );
}

export default Home;
