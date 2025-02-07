import React, { useEffect, useState } from "react";
import axios from "axios";

function FetchData() {
    const [data, setData] = useState(null);

    useEffect(() => {
      axios.get("http://127.0.0.1:8000/")
        .then((response) => setData(response.data))
        .catch((error) => console.error("Error fetching data:", error));
    }, []);
  
    return (
      <div>
        <h1>FastAPI + React</h1>
        {data ? <p>{data.message}</p> : <p>Loading...</p>}
      </div>
    );
  };
    
  return (
    <div>FetchData</div>
  )

export default FetchData