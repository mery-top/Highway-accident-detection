import React, { useState, useEffect, useRef } from "react";
import "../styles/home.css";
import { Line } from "react-chartjs-2"; // Import the Line chart component from Chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);

function Home() {
  return (
    <div>
      <PatientInfo />
    </div>
  );
}

function PatientInfo() {
  const [data, setData] = useState({
    heartbeat: 0,
    temperature: 0,
    latitude: null,
    longitude: null,
    magnitude: 0,
    status: "No accident detected",
  });

  const [frozenMagnitude, setFrozenMagnitude] = useState(null); // Store frozen magnitude
  const chartRef = useRef(null); // Reference to manage the chart instance

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/accident-data");
        const result = await response.json();

        if (frozenMagnitude === null && result.magnitude > 1) {
          setFrozenMagnitude(result.magnitude); // Freeze magnitude at first accident detection
        }

        setData((prevData) => ({
          ...prevData,
          ...result,
          magnitude: frozenMagnitude !== null ? frozenMagnitude : result.magnitude, // Maintain frozen magnitude
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Poll data every 3 seconds
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [frozenMagnitude]);

  const errorFactor = 263 / 100;

  // Convert temperature from Fahrenheit to Celsius and apply error correction
  const convertFahrenheitToCelsius = (fahrenheit) => {
    const correctedFahrenheit = fahrenheit / errorFactor; // Apply error correction
    return ((correctedFahrenheit - 32) * 5) / 9; // Convert to Celsius
  };

  // Apply error correction to heartbeat rate
  const convertHeartbeat = (heartbeat) => {
    const errorFactor = 10;  // Adjust this factor based on your sensor's error range
    return heartbeat / errorFactor;
  };

  // ECG Chart Data Setup
  const ecgData = {
    labels: Array.from({ length: 100 }, (_, i) => i), // 100 time intervals for ECG simulation
    datasets: [
      {
        label: "ECG Signal",
        data: Array.from({ length: 100 }, () => Math.sin(Math.random() * Math.PI * 2)), // Simulated ECG signal data
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.2, // Smooth lines to simulate the ECG waves
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "ECG Graph",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amplitude",
        },
        min: -1,
        max: 1,
      },
    },
  };

  return (
    <div>
      <h2>Patient Info</h2>
      <div className="home-container">
        <div className="flex-row">
        <div className="flex-box2">
            <h3>Location and Severity</h3>
            <p>Latitude: {data.latitude || "N/A"}</p>
            <p>Longitude: {data.longitude || "N/A"}</p>
            <p>Check: {data.magnitude}</p>
            <p>{frozenMagnitude !== null ? `Impact Magnitude: ${frozenMagnitude}` : ""}</p>
          </div>
          <div className="flex-col1">
          <div className="flex-box4">
            <h3>Accident Status</h3>
            <p>{frozenMagnitude !== null ? "Accident is detected" : ""}</p>
          </div>
          <div className="flex-box3">
            <h3>Body Temperature</h3>
            <p>{convertFahrenheitToCelsius(data.temperature).toFixed(2)} °C</p>
          </div>
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-box1">
            <h3>Heartbeat Rate</h3>
            <p>{convertHeartbeat(data.heartbeat).toFixed(2)} BPM</p>
            <div style={{ width: "100%", height: "300px" }}>
              <Line ref={chartRef} data={ecgData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
