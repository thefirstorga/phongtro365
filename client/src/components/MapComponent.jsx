import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

const Geocoder = () => {
  const map = useMap(); // Lấy đối tượng bản đồ từ React-Leaflet
  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
    })
      .on('markgeocode', (e) => {
        const { bbox } = e.geocode;
        const bounds = L.latLngBounds(bbox.getSouthWest(), bbox.getNorthEast());
        map.fitBounds(bounds); // Zoom đến vị trí được tìm thấy
      })
      .addTo(map); // Thêm geocoder vào bản đồ

    return () => map.removeControl(geocoder); // Dọn dẹp khi unmount
  }, [map]);

    const googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    googleStreets.addTo(map)

  return null; // Component không hiển thị gì
};

const MapComponent = () => {
  const position = [21.0285, 105.8542]; // Hà Nội (ví dụ)

  return (
    <div className="flex flex-col items-center w-full">
      {/* Bản đồ */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        className="border border-gray-200 shadow-lg rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Geocoder />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
