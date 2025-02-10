import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../styles/login.css';
import logo from "../assets/images/logo-highway.png";

function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // For navigation
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post("http://127.0.0.1:8000/login", { password });
            // Log the response to ensure it's correct
            console.log("Login response:", response);
            
            // Check if the response contains a token
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);  // Store JWT token
                navigate("/home");
            } else {
                setError("Unexpected error. No token received.");
            }
        } catch (err) {
            // Log the error to understand what went wrong
            console.error("Login error:", err);

            if (err.response) {
                // This means the error is coming from the backend
                setError(err.response.data.detail || "Incorrect password. Try again.");
            } else {
                setError("An unexpected error occurred.");
                console.log(err)
            }
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" />
            <div className="text">
                <h1>Highway Accident Detection<br /> and Mitigation</h1>
                <form>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                    <button className="button-54" type="submit" onClick={handleLogin} >Sign in</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
}

export default Login;
