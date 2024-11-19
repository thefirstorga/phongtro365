import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

const HANOI_BOUNDS = [
  [20.8000, 105.6000], // Tây Nam
  [21.4000, 106.2000], // Đông Bắc
];

const Geocoder = () => {
    const map = useMap(); // Lấy đối tượng bản đồ từ React-Leaflet
    useEffect(() => {
      const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
      })
        .on('markgeocode', (e) => {
          const { bbox } = e.geocode;
          const bounds = L.latLngBounds(bbox.getSouthWest(), bbox.getNorthEast());
          const center = bounds.getCenter(); // Lấy tọa độ trung tâm của bounding box
          if (
            center.lat >= HANOI_BOUNDS[0][0] &&
            center.lat <= HANOI_BOUNDS[1][0] &&
            center.lng >= HANOI_BOUNDS[0][1] &&
            center.lng <= HANOI_BOUNDS[1][1]
          ) {
            map.fitBounds(bounds);
          } else {
            alert('Vị trí ngoài khu vực Hà Nội');
          }
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

// phần này là được nè???
const AddressPickerMap = ({initialPosition,  onSave, onClose }) => {
    const [markerPosition, setMarkerPosition] = useState(null);

    const MapClickHandler = () => {
        useMapEvents({
          click(e) {
              const { lat, lng } = e.latlng;
              if (
                lat >= HANOI_BOUNDS[0][0] &&
                lat <= HANOI_BOUNDS[1][0] &&
                lng >= HANOI_BOUNDS[0][1] &&
                lng <= HANOI_BOUNDS[1][1]
              ) {
                setMarkerPosition([lat, lng]); // Cập nhật Marker
              } else {
                alert('Vị trí ngoài khu vực Hà Nội');
              }
        
          },
        });
        return null;
    };
    
    useEffect(() => {
        // Cập nhật marker khi initialPosition thay đổi
        if (initialPosition) {
          setMarkerPosition(initialPosition);
        }
      }, [initialPosition]);


    const mapCenter = initialPosition || [21.0285, 105.8542]; // Nếu không có marker, lấy tọa độ Hà Nội
    const zoomLevel = initialPosition ? 17 : 13; // Zoom cao hơn khi có vị trí đã chọn
    
    return (
        <div className="relative">
          <MapContainer
              center={mapCenter}
              zoom={zoomLevel}
              style={{ height: '600px', width: '100%' }}
              className="border border-gray-200 shadow-lg rounded-lg"
              maxBounds={HANOI_BOUNDS} // Giới hạn bản đồ
              maxBoundsViscosity={1.0} // Không cho kéo ra ngoài bounds
          >
              <MapClickHandler />
              {markerPosition && <Marker position={markerPosition} />}
              <Geocoder />
              {/* <Geocoder onGeocode={(latlng) => setMarkerPosition([latlng.lat, latlng.lng])} /> */}
          </MapContainer>
          <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => onSave(markerPosition)}
                className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
              >
              Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
              >
              Close
              </button>
          </div>
        </div>
    );
};

//còn phần này thì lại không được nè:))). Đcm đ hiểu là do chỗ nào
// const AddressPickerMap = ({ onSave, onClose }) => {
//     const [markerPosition, setMarkerPosition] = useState(null);
  
//     // Hàm xử lý sự kiện click trên bản đồ
//     const MapClickHandler = () => {
//       useMapEvents({
//         click(e) {
//           const { lat, lng } = e.latlng;
//           setMarkerPosition([lat, lng]); // Cập nhật tọa độ marker
//         },
//       });
//       return null; // Không hiển thị gì
//     };
  
//     return (
//       <div className="relative">
//         <MapContainer
//           center={[21.0285, 105.8542]} // Hà Nội
//           zoom={13}
//           style={{ height: '400px', width: '100%' }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <MapClickHandler />
//           {markerPosition && <Marker position={markerPosition} />}
//         </MapContainer>
//         <div className="flex justify-end space-x-2 mt-2">
//           <button
//             onClick={() => onSave(markerPosition)}
//             className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
//           >
//             Save
//           </button>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   };

export default AddressPickerMap;
