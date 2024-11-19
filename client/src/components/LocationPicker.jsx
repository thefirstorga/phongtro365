import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

const HANOI_BOUNDS = [
  [20.8000, 105.6000], // Tây Nam
  [21.4000, 106.2000], // Đông Bắc
];

const Geocoder = ({ setMarkerPosition }) => {
    const map = useMap();
    useEffect(() => {
        const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        })
        .on('markgeocode', (e) => {
            const { bbox } = e.geocode;
            const bounds = L.latLngBounds(bbox.getSouthWest(), bbox.getNorthEast());
            const center = bounds.getCenter();
            if (
            center.lat >= HANOI_BOUNDS[0][0] &&
            center.lat <= HANOI_BOUNDS[1][0] &&
            center.lng >= HANOI_BOUNDS[0][1] &&
            center.lng <= HANOI_BOUNDS[1][1]
            ) {
            map.fitBounds(bounds);
            setMarkerPosition([center.lat, center.lng]);
            } else {
            alert('Vị trí ngoài khu vực Hà Nội');
            }
        })
        .addTo(map);

        return () => map.removeControl(geocoder);
    }, [map, setMarkerPosition]);

        const googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
        });
        googleStreets.addTo(map)
    return null;
};

const LocationPicker = ({ latitude, longitude, onChange }) => {
  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude ? [latitude, longitude] : null
  ); // Vị trí chính thức
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null); // Vị trí tạm thời
  const [showMap, setShowMap] = useState(false);

  const [isMapOpened, setIsMapOpened] = useState(false);

  // chỗ useEf này là để show ra phần ladlong đã set từ trước nha
  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (
            lat >= HANOI_BOUNDS[0][0] && lat <= HANOI_BOUNDS[1][0] &&
            lng >= HANOI_BOUNDS[0][1] && lng <= HANOI_BOUNDS[1][1]
        ) {
            setMarkerPosition([lat, lng])
            setTempMarkerPosition([lat, lng]); // Lưu vị trí tạm thời
        } else {
          alert('Vị trí bạn chọn ngoài khu vực Hà Nội, vui lòng chọn lại!');
        }
      },
    });
    return null;
  };

  return (
    <div className='z-20'>
        <div className="my-1">
            {isMapOpened && (
                latitude && longitude ? (
                <p className="text-green-500">Bạn đã chọn địa chỉ trên bản đồ thành công</p>
                ) : (
                <p className="text-red-500">Bạn chưa lưu địa chỉ vừa chọn trên bản đồ</p>
                )
            )}
        </div>
        <button
            onClick={(e) => {
                e.preventDefault();
                setIsMapOpened(true);
                setShowMap(true);
            }}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
            Chọn vị trí trên bản đồ
        </button>

        {showMap && (
            <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
                onClick={() => setShowMap(false)}
            >
            <div
                className="bg-white p-4 rounded-lg shadow-lg w-3/4"
                onClick={(e) => e.stopPropagation()}
            >
                <MapContainer
                    center={markerPosition || [21.0285, 105.8542]}
                    zoom={markerPosition ? 17 : 13}
                    style={{ height: '600px', width: '100%' }}
                    maxBounds={HANOI_BOUNDS}
                    maxBoundsViscosity={1.0}
                >
                    <MapClickHandler />
                    {tempMarkerPosition && <Marker position={tempMarkerPosition} />}
                    {markerPosition && <Marker position={markerPosition} />}
                    <Geocoder setMarkerPosition={setTempMarkerPosition} />
                </MapContainer>
                <div className="flex justify-end space-x-2 mt-2">
                <button
                    onClick={(e) => {
                        e.preventDefault()
                    if (tempMarkerPosition) {
                        setMarkerPosition(tempMarkerPosition); // Lưu vị trí chính thức
                        onChange({
                        latitude: tempMarkerPosition[0],
                        longitude: tempMarkerPosition[1],
                        });
                        setShowMap(false);
                    } else {
                        alert('Vui lòng chọn hoặc tìm vị trí trước khi lưu!');
                    }
                    }}
                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                    Save
                </button>
                </div>
            </div>
            </div>
        )}
    </div>
  );
};


export default LocationPicker;