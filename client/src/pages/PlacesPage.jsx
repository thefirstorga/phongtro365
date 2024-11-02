// import React, { useEffect, useState } from 'react'
// import { Link, Navigate, useParams } from 'react-router-dom'
// import PlacesFormPage from './PlacesFormPage'
// import AccountNav from '../AccountNav'
// import axios from 'axios'

// function PlacesPage() {
//   const [places, setPlaces] = useState([])
//   useEffect(() => {
//     axios.get('/post/places').then(({data}) => {
//       setPlaces(data)
//       // console.log(data.length)
//     })
//   }, [])
//   // console.log(places)
//   return (
//     <div>
//         <AccountNav />
//         <div className='text-center'>
//             <Link className='inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full' to={'/account/places/new'}>
//                 Add new place
//             </Link>
//         </div>
//         <div className='mt-4'>
//           {console.log(places.length)}
//           {places.length > 0 && (places.map(place => {
//             <Link to={'/account/places/' + place.id} className='flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl'>
//               {/* <div className='w-32 h-32 bg-gray-300 grow shrink-0'>
//                 {place.photos.length > 0 && (
//                   <img src={place.photos[0]} alt="" />
//                 )}
//               </div> */}
//               <div className='grow-0 shrink'>
//                 <h2 className='text-xl'>{place.title}</h2>
//                 <p className='text-sm mt-2'>{place.description}</p>
//               </div>
//             </Link>
//           }))}
//         </div>
//     </div>
//   )
// }

// export default PlacesPage

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountNav from '../AccountNav';
import axios from 'axios';

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
                {place.photos.length > 0 && (
                  <img src={'http://localhost:4000/post/uploads/'+place.photos[0].url} alt="" />
                )}
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
