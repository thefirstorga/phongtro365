import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
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
                  {/* <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  /> */}
                  <Geocoder />
                  {places.map((place, index) =>
                      place.latitude && place.longitude ? (
                          <Marker key={index} position={[place.latitude, place.longitude]}>
                              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={true}>
                                  <div style={{ textAlign: 'center' }}>
                                      <img
                                          src={'http://localhost:4000/post/uploads/' + place.photos[0].url}
                                          alt="house"
                                          style={{ width: '80px', height: '50px', borderRadius: '4px' }}
                                      />
                                      <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}>
                                          {place.address}
                                      </p>
                                      <p style={{fontSize: '12px', fontWeight: 'bold' }}>
                                          {place.price}
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

// import React from 'react';
// import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';

// function MapComponent({ places }) {
//     if (!places || places.length === 0) {
//         return <p>Không có dữ liệu để hiển thị bản đồ.</p>;
//     }

//     // Default position nếu không có tọa độ
//     const defaultPosition = [10.762622, 106.660172]; // Tọa độ TP. Hồ Chí Minh

//     return (
//         <MapContainer
//             center={places[0]?.latitude ? [places[0].latitude, places[0].longitude] : defaultPosition}
//             zoom={13}
//             style={{ height: '500px', width: '100%' }}
//         >
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//             />
//             {places.map((place, index) =>
//                 place.latitude && place.longitude ? (
//                     <Marker key={index} position={[place.latitude, place.longitude]}>
//                         <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
//                             <div style={{ textAlign: 'center' }}>
//                                 <img
//                                     src={place.image}
//                                     alt="house"
//                                     style={{ width: '80px', height: '50px', borderRadius: '4px' }}
//                                 />
//                                 <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}>
//                                     {place.address}
//                                 </p>
//                             </div>
//                         </Tooltip>
//                     </Marker>
//                 ) : null
//             )}
//         </MapContainer>
//     );
// }

// export default MapComponent;

