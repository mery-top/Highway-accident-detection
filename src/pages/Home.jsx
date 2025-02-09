import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
function Home() {
    const [data, setData] = useState(null)

    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/home")
        .then((response)=> setData(response.data))
        .catch((error)=> console.error("Error", error))
    },[])

  return (
    <div>{data ? data : "Loading HOME..."}</div>
  )
}

export default Home