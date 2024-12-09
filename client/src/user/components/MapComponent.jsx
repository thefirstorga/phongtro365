import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { BASE_URL } from '../../config';

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

const MapComponent = ({ places }) => {
    // Kiểm tra nếu không có địa điểm
    if (!places || places.length === 0) {
        return <div>No places to display on the map!</div>;
    }
    const [showMap, setShowMap] = useState(false);

    // Tính tọa độ trung tâm dựa trên danh sách places
    const center = [
        places[0].latitude || 0, // Lấy tọa độ latitude của ngôi nhà đầu tiên
        places[0].longitude || 0, // Lấy tọa độ longitude của ngôi nhà đầu tiên
    ];

    return (
        <div>
          <button
              onClick={(e) => {
                  e.preventDefault();
                  setShowMap(true);
              }}
              className="px-2 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
              Hiện bản đồ
          </button>
          {showMap && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
                onClick={() => setShowMap(false)}
                >
              <div className="bg-white p-4 rounded-lg shadow-lg w-3/4"
                onClick={(e) => e.stopPropagation()}
              >
                <MapContainer
                  center={places[0]?.latitude ? [places[0].latitude, places[0].longitude] : defaultPosition}
                  zoom={13}
                  style={{ height: '600px', width: '100%' }}
              >
                  <Geocoder />
                  {places.map((place, index) =>
                      place.latitude && place.longitude ? (
                          <Marker key={index} position={[place.latitude, place.longitude]}>
                              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={true}>
                                  <div className='w-36' style={{ textAlign: 'center' }}>
                                      <img
                                          src={BASE_URL + place.photos[0].url}
                                          alt="house"
                                          style={{ width: '80px', height: '50px', borderRadius: '4px' }}
                                      />
                                      {/* <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}> */}
                                      <p className="font-bold text-sm text-gray-800 mt-1 overflow-hidden text-ellipsis line-clamp-2">
                                        {place.address}
                                      </p>
                                      <p style={{fontSize: '12px', fontWeight: 'bold' }}>
                                          {place.price} VNĐ/tháng
                                      </p>
                                  </div>
                              </Tooltip>
                          </Marker>
                      ) : null
                  )}
                </MapContainer>
              </div>
            </div>
          )}
        </div>
    );
};

export default MapComponent;
