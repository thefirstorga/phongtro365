import React, { useEffect } from 'react';
import { MapContainer, Marker,useMap, Tooltip } from 'react-leaflet';
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

function MapIndexPage({ places }) {
    if (!places || places.length === 0) {
        return <p>Không có dữ liệu để hiển thị bản đồ.</p>;
    }

    // Default position nếu không có tọa độ
    const defaultPosition = [10.762622, 106.660172]; // Tọa độ TP. Hồ Chí Minh

    return (
        <MapContainer
            center={places[0]?.latitude ? [places[0].latitude, places[0].longitude] : defaultPosition}
            zoom={13}
            style={{ height: '513px', width: '100%' }}
        >
            <Geocoder />
            {places.map((place, index) =>
                place.latitude && place.longitude ? (
                    <Marker key={index} position={[place.latitude, place.longitude]}>
                        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    src={
                                        "http://localhost:4000/post/uploads/" + place.photos[0]?.url
                                      }
                                    alt="house"
                                    style={{ width: '80px', height: '50px', borderRadius: '4px' }}
                                />
                                <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}>
                                    {place.title}
                                </p>
                            </div>
                        </Tooltip>
                    </Marker>
                ) : null
            )}
        </MapContainer>
    );
}

export default MapIndexPage;

