import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";



function App() {
    
    return (
      <Routes>
                {/* Public route */}
                <Route path="/" element={<Login />} />

                {/* Route that asks for password again before accessing Home */}
                <Route
                    path="/home"
                    element={
                        localStorage.getItem("token") ? <Home /> : <Navigate to="/" />
                    }
                />
            </Routes>
    );
}

export default App;

