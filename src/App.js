import React from "react";
import { useEffect, useState } from "react";
import axios from "axios"
import Login from "./components/Login"
function App() {

  const [data, setData] = useState(null)

  useEffect(() =>{
    axios.get("http://127.0.0.1:8000/login")
    .then((response)=> setData(response.data))
    .catch((error)=> console.error("Error", error))
  },[])

  

  return (
    <div>
      <Login/>
    </div>
  );
}

export default App;
