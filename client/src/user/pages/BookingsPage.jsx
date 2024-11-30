import React, { useEffect, useState } from 'react'
import AccountNav from '../components/AccountNav'
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

    if(bookings.length === 0) {
        return (
            <div>Bạn chưa thuê nhà nào</div>
        )
    }

  return (
    <div className='lg:mx-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:gap-8'>
            {bookings?.length > 0 && bookings.map(booking => (
                <Link to={'/place/' + booking.place.id} className='flex gap-4 mt-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500'>
                    <div className='w-48 h-48'>
                        <PlaceImg place={booking.place} />
                    </div>
                    <div className='py-3 pr-3 grow'>
                        <h2 className='text-xl'>{booking.place.title}</h2>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default BookingsPage
