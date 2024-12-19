import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import axios from 'axios';
import { BASE_URL } from '../../config';
import NotificationButton from './NotificationButton';

function Header() {
  const { user, setUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function logout() {
    await axios.post('/auth/logout');
    setUser(null); // Xóa thông tin user
    setMenuOpen(false); // Đóng menu
    window.location.href = '/';
  }


  return (
    <div className="sticky top-0 bg-white z-20 border-b-2 shadow-sm h-20 flex items-center">
      <header className="w-full flex justify-between lg:px-36 md:px-8 sm:px-4 items-center">
        {/* Logo */}
        <Link to={'/'} className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="font-bold text-xl">phongtro365</span>
        </Link>
        <div className='flex gap-2'>
          {user && <NotificationButton />}
          {/* User Section */}
          <div ref={menuRef} className="relative">
            {/* Nếu chưa đăng nhập */}
            {!user && (
              <Link
                to="/login"
                className="flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1 cursor-pointer"
              >
                <div className="bg-gray-500 text-white rounded-full border border-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-11"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </Link>
            )}
            {/* Nếu đã đăng nhập */}
            {!!user && (
              <div>
                <div
                  className="flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1 cursor-pointer relative"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <img
                    src={
                      user?.avatar
                        ? BASE_URL + user.avatar
                        : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'
                    }
                    alt="Avatar"
                    className="rounded-full w-11 h-11 object-cover"
                  />
                  {/* Mũi tên ở góc dưới bên phải */}
                  <div className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 16.5c-.18 0-.36-.06-.5-.18l-5-4a.75.75 0 1 1 1-.84l4.5 3.6 4.5-3.6a.75.75 0 1 1 1 .84l-5 4c-.14.12-.32.18-.5.18Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {menuOpen && (
                  <div className="absolute lg:left-0 right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div
                      className="block px-4 py-2 hover:bg-gray-100 border-b-2"
                      onClick={() => setMenuOpen(false)} // Đóng menu
                    >
                      {user.email}
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)} // Đóng menu
                    >
                      Trang cá nhân
                    </Link>
                    <Link
                      to="/account/bookings"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)} // Đóng menu
                    >
                      Booking của bạn
                    </Link>
                    <Link
                      to="/account/places"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)} // Đóng menu
                    >
                      Nhà của bạn
                    </Link>
                    <Link
                      to="/account/favourites"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)} // Đóng menu
                    >
                      Nhà yêu thích
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
