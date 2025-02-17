import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate,  useLocation } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Photos from "./pages/MapPage";
// uvicorn main:app --reload



function App() {
  const location = useLocation();
    return (
      <>
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        
        {/* Public route */}
        <Route path="/" element={<Login />} />
        <Route path="/photos" element={<Photos/>}/>

        {/* Route that asks for password again before accessing Home */}
        <Route
            path="/home"
            element={
                localStorage.getItem("token") ? <Home /> : <Navigate to="/" />
            }
        />
    </Routes></>
      
    );
}

export default App;

