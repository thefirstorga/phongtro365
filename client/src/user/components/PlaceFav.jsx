import { useState, useEffect } from 'react';
import axios from 'axios';

const PlaceFav = ({ place }) => {
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    // Kiểm tra xem Place đã được yêu thích hay chưa khi component được render
    const checkIfFavourite = async () => {
      try {
        const response = await axios.get('/post/favourites/check', {
          params: { placeId: place.id },
        });
        setIsFavourite(response.data.isFavourite);
      } catch (error) {
        console.error("Error checking favourite status", error);
      }
    };
    checkIfFavourite();
  }, [place.id]);

  const toggleFavourite = async (event) => {
    event.preventDefault(); // Ngăn chặn chuyển hướng
    event.stopPropagation(); // Ngăn chặn sự kiện lan lên cha
    try {
      const method = isFavourite ? 'DELETE' : 'POST';
      const response = await axios({
        method: method,
        url: '/post/favourites',
        data: { placeId: place.id },
      });
      setIsFavourite(response.data.isFavourite); // Cập nhật trạng thái yêu thích
    } catch (error) {
      console.error("Error toggling favourite status", error);
    }
  };

  return (
    <div className="">
        <button
            onClick={(event) => toggleFavourite(event)}
            className="pt-2 bg-transparent border-none" // Bỏ nền và viền của button
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill={isFavourite ? 'currentColor' : 'white'} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isFavourite ? 'currentColor' : 'black'} className={`size-8 ${isFavourite ? 'text-primary' : 'text-gray-400'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        </button>

    </div>
  );
};

export default PlaceFav;
