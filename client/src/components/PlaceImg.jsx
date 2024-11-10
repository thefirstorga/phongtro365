// import React from 'react'

// function PlaceImg({place, index = 0, className = null}) {
//     if(!place.photos?.length) return ''
//     if(!className) className = 'object-cover aspect-square'
//     // console.log(place.photos[index].url);
//   return (
//       <img className={className} src={'http://localhost:4000/post/uploads/'+place.photos[index].url} alt="" />
//   )
// }

// export default PlaceImg
import React, { useState } from 'react';

function PlaceImg({ place, className = null }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    if (!place.photos?.length) return '';
    if (!className) className = 'object-cover aspect-square';

    const handlePrevPhoto = (event) => {
      event.stopPropagation(); 
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? place.photos.length - 1 : prevIndex - 1
        );
    };

    const handleNextPhoto = (event) => {
      event.stopPropagation(); 
        setCurrentIndex((prevIndex) =>
            prevIndex === place.photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleIndicatorClick = (index) => {
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
                src={'http://localhost:4000/post/uploads/' + place.photos[currentIndex].url}
                alt=""
            />

            {/* Nút xem ảnh trước */}
            {isHovered && (
                <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                    &#8592;
                </button>
            )}

            {/* Nút xem ảnh kế tiếp */}
            {isHovered && (
                <button
                    onClick={handleNextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                    &#8594;
                </button>
            )}

            {/* Chấm chỉ báo vị trí ảnh */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {place.photos.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleIndicatorClick(index)}
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



