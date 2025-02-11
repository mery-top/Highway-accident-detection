import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Add Leaflet's CSS for styling
import L from 'leaflet';

const Map = () => {
  const position = [51.505, -0.09]; // Latitude and Longitude of the center of the map

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            A sample marker at this location!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
