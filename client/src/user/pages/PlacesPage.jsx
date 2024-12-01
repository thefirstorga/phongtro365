import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PlaceImg from '../components/PlaceImg';

function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/post/user-places')
      .then(({ data }) => {
        setPlaces(data);
      });
  }, []);

  // Phân loại places theo status
  const placesSee = places.filter(place => place.status === 'SEE');
  const placesHidden = places.filter(place => place.status === 'HIDDEN');
  const placesDelete = places.filter(place => place.status === 'DELETE');

  const renderPlaces = (placesList, title) => (
    <div className='mt-8'>
      <h2 className='text-2xl font-bold mb-4'>{title}</h2>
      {placesList.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:gap-8'>
          {placesList.map(place => (
            <Link
              to={'/place/' + place.id}
              className='flex gap-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500'
              key={place.id}
            >
              <div className='w-48 h-48'>
                <PlaceImg place={place} />
              </div>
              <div className='py-3 pr-3 grow'>
                <h2 className='text-xl'>{place.title}</h2>
                <p className='border border-t-2 text-sm mt-2'>{place.description}</p>
                <p className='text-sm mt-4'>{place.bookings.length} người đang chờ duyệt</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>Không có nhà nào trong danh mục này.</p>
      )}
    </div>
  );

  return (
    <div className='mb-4'>
      <div className='fixed right-12 bottom-12 group z-30'>
        <div className='text-center'>
          <Link className='inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full' to={'/account/places/new'}>
            Add new home
          </Link>
        </div>
      </div>

      {/* Hiển thị các nhà theo từng status */}
      {renderPlaces(placesSee, 'Các nhà của bạn')}
      {renderPlaces(placesHidden, 'Các nhà bạn đang ẩn')}
      {renderPlaces(placesDelete, 'Các nhà mà bạn đã bị vi phạm')}
    </div>
  );
}

export default PlacesPage;
