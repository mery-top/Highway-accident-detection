import React from "react";
import { useNavigate } from "react-router-dom";

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
      <h1>Welcome to the Home Page</h1>
      <p>Here is the main content of your app.</p>

      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
