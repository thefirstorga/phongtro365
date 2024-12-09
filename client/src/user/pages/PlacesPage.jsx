import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlaceImg from '../components/PlaceImg';
import { UserContext } from '../components/UserContext';

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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

  const handleAddPlace = () => {
    // Kiểm tra xem user có phone và zalo chưa
    if (user?.phone && user?.zalo) {
      navigate('/account/places/new');   // Chuyển hướng đến trang thêm nhà mới
    } else {
      setShowPopup(true);  // Hiển thị popup nếu thiếu thông tin
    }
  };

  const renderPlaces = (placesList, title) => (
    <div className='mt-8'>
      <h2 className='text-2xl font-bold mb-4'>{title}</h2>
      {placesList.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {placesList.map(place => (
            <Link
              to={'/place/' + place.id}
              className='flex gap-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500'
              key={place.id}
            >
              <div className='w-56'>
                <PlaceImg place={place} />
              </div>
              <div className='py-3 pr-3 grow overflow-hidden w-80'>
                <h2 className='font-bold text-2xl text-gray-800 mt-1 truncate hover:truncate-none transition-all duration-300 mb-4 '>{place.title}</h2>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{place.address}</p>
                {place.bookings.filter((booking) => booking.status === 'PENDING').length > 0 && (
                  <p className='text-md mt-4 truncate hover:truncate-none transition-all duration-300'>
                    Có <b>{place.bookings.filter((booking) => booking.status === 'PENDING').length}</b> người đang chờ duyệt
                  </p>
                )}
                {place.bookings.filter((booking) => booking.status === 'APPROVED').length > 0 && (
                  <p className='text-md mt-4 truncate hover:truncate-none transition-all duration-300'>
                    Đang có người thuê
                  </p>
                )}
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
    <div className='mb-4 lg:mx-16'>
      <div className='fixed right-12 bottom-12 group z-30'>
        <div className='text-center'>
          <button
            onClick={handleAddPlace}
            className='inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full'
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            Thêm nhà mới
          </button>
        </div>
      </div>

      {/* Hiển thị các nhà theo từng status */}
      {renderPlaces(placesSee, 'Các nhà của bạn')}
      {renderPlaces(placesHidden, 'Các nhà bạn đang ẩn')}
      {renderPlaces(placesDelete, 'Các nhà mà bạn đã bị vi phạm')}

      {/* Popup thông báo */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded-lg max-w-sm">
            <h3 className="text-xl font-semibold">Thông báo</h3>
            <p className="mt-2">Bạn cần cập nhật đầy đủ thông tin tài khoản (phone và zalo) trước khi thêm nhà mới.</p>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-primary text-white py-2 px-4 rounded-full"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacesPage;
