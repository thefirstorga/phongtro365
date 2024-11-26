import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import PlaceImg from '../components/PlaceImg';

function ProfileVisitPage() {
    const { id } = useParams();
    const [user,setUser] = useState(null)

    useEffect(() => {
        if (!id) return;
        axios.get(`/auth/profile/${id}`)
            .then(response => {
                setUser(response.data.info);
            })
            .catch(error => {
                console.error("There was an error fetching the place data!", error);
            });
    }, [id])

    if(!user) {
        return (
            <div>Loading...</div>
        )
    }

  return (
    <div>
        {/* phần trên */}
        <div className="mt-4 bg-gray-100 group transition duration-300 px-8 py-8 rounded-lg shadow-md">
            <h2 className="font-semibold text-2xl text-gray-800 mb-6">Thông tin cá nhân</h2>
            <div 
                className="my-4 rounded-lg p-4"
            >
                {/* Hàng 1: Ảnh và tên */}
                <div className="flex items-center mb-6">
                <div
                    className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300 shadow-lg flex-shrink-0"
                >
                    <img
                    src={
                        user.avatar
                        ? `http://localhost:4000/post/uploads/${user.avatar}`
                        : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    />
                </div>
                <div className="ml-6">
                    <p className="font-semibold text-4xl">{user.name}</p>
                </div>
                </div>

                {/* Hàng 2: Số điện thoại và Zalo */}
                <div className="grid grid-cols-2 gap-6">
                <div className="relative ml-8">
                    <p className="text-gray-800 font-semibold text-2xl">Số điện thoại</p>
                    <div className="flex items-center">
                    <p className="text-gray-800 font-medium">{user.phone}</p>
                    <button
                        onClick={() => navigator.clipboard.writeText(user.phone)}
                        className="ml-2 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                    <p className="text-gray-800 font-medium">{user.zalo}</p>
                    <button
                        onClick={() => navigator.clipboard.writeText(user.zalo)}
                        className="ml-2 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
        
        {/* Phần dưới */}
        <div className="mt-4 bg-gray-100 px-8 py-8 rounded-lg shadow-md">
            <h2 className="font-semibold text-2xl text-gray-800 mb-6">Các nhà của {user.name}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:gap-x-8 lg:mx-6'>
                {user.places.length > 0 && (
                    user.places.map(place => (
                        <Link to={'/place/' + place.id} className='flex gap-4 mt-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500' key={place.id}>
                            <div className='w-48 h-48 relative'>
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
    </div>
  )
}

export default ProfileVisitPage