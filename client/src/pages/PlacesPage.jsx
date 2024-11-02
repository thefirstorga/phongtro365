import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountNav from '../AccountNav';
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
      <div className='mt-4'>
        {places.length >0 && (
          places.map(place => (
            <Link to={'/account/places/' + place.id} className='flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl' key={place.id}>
              <div className='flex w-24 h-24 bg-gray-300 grow shrink-0'>
                <PlaceImg place={place} />
              </div>
              <div className='grow-0 shrink'>
                <h2 className='text-xl'>{place.title}</h2>
                <p className='text-sm mt-2'>{place.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default PlacesPage;
