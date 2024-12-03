import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PlaceImg from '../components/PlaceImg'
import { Link } from 'react-router-dom'

function BookingsPage() {
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        axios.get('/booking').then(response => {
            setBookings(response.data)
        })
    },[])

    const rentedBookings = bookings.filter(booking => booking.status === 'RENTED')
    const approvedBookings = bookings.filter(booking => booking.status === 'APPROVED')
    const pendingBookings = bookings.filter(booking => booking.status === 'PENDING')

    if(bookings.length === 0) {
        return (
            <div className='font-semibold text-3xl mt-4'>Bạn chưa thuê nhà nào!</div>
        )
    }

    return (
        <div className='lg:mx-16'>
            {/* Phần PENDING */}
            {pendingBookings.length > 0 && (
                <div className="my-8">
                    <h3 className="text-2xl font-semibold mb-4">Đang chờ duyệt</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:gap-8'>
                        {pendingBookings.map(booking => (
                            <Link to={'/place/' + booking.place.id} className='flex gap-4 mt-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500'>
                                <div className='w-48 h-48'>
                                    <PlaceImg place={booking.place} />
                                </div>
                                <div className='py-3 pr-3 grow'>
                                    <h2 className='text-xl'>{booking.place.title}</h2>
                                    <p className='text-sm text-gray-500'>{booking.place.address}</p>
                                    <p className='text-sm text-gray-500'>Check-out: {booking.checkOut ? new Date(booking.checkOut).toLocaleString() : 'Chưa xác định'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Phần APPROVED */}
            {approvedBookings.length > 0 && (
                <div className="my-8">
                    <h3 className="text-2xl font-semibold mb-4">Nhà đang ở</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:gap-8'>
                        {approvedBookings.map(booking => (
                            <Link to={'/place/' + booking.place.id} className='flex gap-4 mt-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500'>
                                <div className='w-48 h-48'>
                                    <PlaceImg place={booking.place} />
                                </div>
                                <div className='py-3 pr-3 grow'>
                                    <h2 className='text-xl'>{booking.place.title}</h2>
                                    <p className='text-sm text-gray-500'>{booking.place.address}</p>
                                    <p className='text-sm text-gray-500'>Check-out: {new Date(booking.checkOut).toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Phần RENTED */}
            {rentedBookings.length > 0 && (
                <div className="my-8">
                    <h3 className="text-2xl font-semibold mb-4">Đã thuê</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:gap-8'>
                        {rentedBookings.map(booking => (
                            <Link to={'/place/' + booking.place.id} className='flex gap-4 mt-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500'>
                                <div className='w-48 h-48'>
                                    <PlaceImg place={booking.place} />
                                </div>
                                <div className='py-3 pr-3 grow'>
                                    <h2 className='text-xl'>{booking.place.title}</h2>
                                    <p className='text-sm text-gray-500'>{booking.place.address}</p>
                                    <p className='text-sm text-gray-500'>Check-out: {new Date(booking.checkOut).toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookingsPage
