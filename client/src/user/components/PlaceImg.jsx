// import React, { useState } from 'react';

// function PlaceImg({ place, className = null }) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isHovered, setIsHovered] = useState(false);

//     if (!place.photos?.length) return '';
//     if (!className) className = 'object-cover aspect-square';

//     const handlePrevPhoto = (event) => {
//         event.stopPropagation(); // Ngăn chặn sự kiện lan đến Link
//         setCurrentIndex((prevIndex) =>
//             prevIndex === 0 ? place.photos.length - 1 : prevIndex - 1
//         );
//     };

//     const handleNextPhoto = (event) => {
//         event.stopPropagation(); // Ngăn chặn sự kiện lan đến Link
//         setCurrentIndex((prevIndex) =>
//             prevIndex === place.photos.length - 1 ? 0 : prevIndex + 1
//         );
//     };

//     const handleIndicatorClick = (event, index) => {
//         event.stopPropagation(); // Ngăn chặn sự kiện lan đến Link
//         setCurrentIndex(index);
//     };

//     return (
//         <div
//             className="relative"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <img
//                 className={`${className} transition-transform duration-500`}
//                 src={BASE_URL + place.photos[currentIndex].url}
//                 alt=""
//             />

//             {/* Nút xem ảnh trước */}
//             {isHovered && (
//                 <button
//                     onClick={handlePrevPhoto}
//                     className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
//                 >
//                     &#8592;
//                 </button>
//             )}

//             {/* Nút xem ảnh kế tiếp */}
//             {isHovered && (
//                 <button
//                     onClick={handleNextPhoto}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
//                 >
//                     &#8594;
//                 </button>
//             )}

//             {/* Chấm chỉ báo vị trí ảnh */}
//             <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
//                 {place.photos.map((_, index) => (
//                     <button
//                         key={index}
//                         onClick={(e) => handleIndicatorClick(e, index)}
//                         className={`w-2 h-2 rounded-full ${
//                             index === currentIndex ? 'bg-white' : 'bg-gray-500'
//                         }`}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default PlaceImg;

// ở đây fix được rồi nha:))). Hơi ảo
import React, { useState } from 'react';
import { BASE_URL } from '../../config';
import PlaceFav from './PlaceFav'

function PlaceImg({ place, className = null }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    if (!place.photos?.length) return '';
    if (!className) className = 'object-cover aspect-square';

    const handlePrevPhoto = (event) => {
        event.preventDefault(); // Ngăn chặn chuyển hướng
        event.stopPropagation(); // Ngăn chặn sự kiện lan lên cha
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? place.photos.length - 1 : prevIndex - 1
        );
    };

    const handleNextPhoto = (event) => {
        event.preventDefault(); // Ngăn chặn chuyển hướng
        event.stopPropagation(); // Ngăn chặn sự kiện lan lên cha
        setCurrentIndex((prevIndex) =>
            prevIndex === place.photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleIndicatorClick = (event, index) => {
        event.preventDefault(); // Ngăn chặn chuyển hướng
        event.stopPropagation(); // Ngăn chặn sự kiện lan lên cha
        setCurrentIndex(index);
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                className={`${className} transition-transform duration-500`}
                src={BASE_URL + place.photos[currentIndex].url}
                alt="Place"
            />

            <div className="absolute top-0 right-1">
                <PlaceFav place={place}/>
            </div>

            {/* Nút xem ảnh trước */}
            {isHovered && (
                <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
            )}

            {/* Nút xem ảnh kế tiếp */}
            {isHovered && (
                <button
                    onClick={handleNextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            )}

            {/* Chấm chỉ báo vị trí ảnh */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {place.photos.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => handleIndicatorClick(e, index)}
                        className={`w-2 h-2 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-gray-500'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default PlaceImg;
