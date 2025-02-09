import React from 'react'
import '../styles/login.css';
import logo from "../assets/images/logo-highway.png";
function Login() {
  return (
    <div>
      <img src={logo} alt="Logo" />
      <div className="text">
       <h1>Highway Accident Detection<br></br> and Mitigation</h1>
       <button className='button-54'>Sign in</button>
      </div>
      
    </div>
  )
}

export default Login