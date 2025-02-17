import { useState, useEffect } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState({
    latitude: "N/A",
    longitude: "N/A",
    name: "Fetching...",
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse Geocoding using OpenStreetMap Nominatim API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const placeName = data.display_name || "Unknown Location";

            setLocation({ latitude, longitude, name: placeName });
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation((prev) => ({ ...prev, name: "Location unavailable" }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation not supported");
      setLocation((prev) => ({ ...prev, name: "Geolocation not supported" }));
    }
  }, []);

  return (
    <div>
      {/* <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p> */}
      <p>Location: {location.name}</p>
    </div>
  );
};

export default LocationComponent;
