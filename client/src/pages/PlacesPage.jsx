import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountNav from '../components/AccountNav';
import axios from 'axios';
import PlaceImg from '../components/PlaceImg';

function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/post/user-places')
      .then(({ data }) => {
        setPlaces(data);
      })
      // .catch(error => {
      //   console.error("Error fetching places:", error);
      // });
  }, []);

  // console.log(places.length); // Kiểm tra giá trị

  return (
    <div>
      <AccountNav />
      <div className='text-center'>
        <Link className='inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full' to={'/account/places/new'}>
          Add new place
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:gap-8'>
        {places.length >0 && (
          places.map(place => (
            <Link to={'/account/places/' + place.id} className='flex gap-4 mt-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500' key={place.id}>
              <div className='w-48 h-48'>
                <PlaceImg place={place} />
              </div>
              <div className='py-3 pr-3 grow'>
                <h2 className='text-xl'>{place.title}</h2>
                <p className='border border-t-2 text-sm mt-2'>{place.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default PlacesPage;
