import React from 'react';
import MapComponent from '../../user/components/MapComponent';
import PlaceGallery from '../../user/components/PlaceGallery';
import { BASE_URL } from '../../config';

const PlaceDetailsPopup = ({ place, onClose }) => {
    if (!place) return null;

    return (
        <div
            id="popup-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.target.id === 'popup-overlay' && onClose()}
        >
            <div className="bg-white p-6 rounded shadow-md w-5/6 max-h-[90%] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-semibold text-gray-800">{place.title}</h1>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Address and Map */}
                <div className="flex gap-4 my-2">
                    <p className="flex gap-1 items-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {place.address}
                    </p>
                    {place.latitude && (
                        <MapComponent places={[place]} />
                    )}
                    <a
                        className="flex gap-1 px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://maps.google.com/?q=${place.address}`}
                    >
                        Xem trên Google Map
                    </a>
                </div>

                {/* Gallery */}
                <PlaceGallery place={place} />

                {/* Thông tin chủ nhà */}
                <div className="mt-4 bg-gray-100 group transition duration-300 px-8 py-8 rounded-lg shadow-md">
                    <h2 className="font-semibold text-2xl text-gray-800 mb-6">Thông tin chủ nhà</h2>
                    <div className="my-4 rounded-lg p-4">
                        {/* Hàng 1: Ảnh và tên */}
                        <div className="flex items-center mb-6">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300 shadow-lg flex-shrink-0">
                                <img
                                    src={
                                        place.owner.avatar
                                            ? BASE_URL + place.owner.avatar
                                            : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'
                                    }
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="ml-6">
                                <p className="font-semibold text-4xl">{place.owner.name}</p>
                                <p className="text-gray-600">{place.owner.email}</p>
                            </div>
                        </div>

                        {/* Hàng 2: Số điện thoại và Zalo */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative ml-8">
                                <p className="text-gray-800 font-semibold text-2xl">Số điện thoại</p>
                                <div className="flex items-center">
                                    <p className="text-gray-800 font-medium">{place.owner.phone}</p>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(place.owner.phone)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                        title="Copy số điện thoại"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <p className="text-gray-800 font-semibold text-2xl">Zalo</p>
                                <div className="flex items-center">
                                    <p className="text-gray-800 font-medium">{place.owner.zalo}</p>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(place.owner.zalo)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                        title="Copy Zalo"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Description and Details */}
                <div className="mt-6">
                    <h2 className="font-semibold text-2xl text-gray-800">Mô tả</h2>
                    <p className="text-gray-600 mt-2">{place.description}</p>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <p className="text-gray-800 font-bold">Diện tích: {place.area} m²</p>
                        <p className="text-gray-800 font-bold">Thời gian thuê: {place.duration} tháng</p>
                        <p className="text-gray-800 font-bold">Giá thuê: {place.price.toLocaleString()} VND</p>
                    </div>
                </div>

                {/* Extra Info */}
                {place.extraInfo && (
                    <div className="mt-6 border-t pt-4">
                        <h2 className="font-semibold text-2xl text-gray-800">Thông tin thêm</h2>
                        <p className="text-gray-600 mt-4">{place.extraInfo}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaceDetailsPopup;
