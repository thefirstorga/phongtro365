import React, { useEffect, useState } from 'react'
import AccountNav from '../components/AccountNav'
import axios from 'axios'
import PlaceImg from '../components/PlaceImg'
import {format, differenceInCalendarDays} from 'date-fns'
import { Link } from 'react-router-dom'

function BookingsPage() {
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        axios.get('/booking').then(response => {
            setBookings(response.data)
        })
    },[])

  return (
    <div className='lg:mx-16'>
        <AccountNav />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:gap-8'>
            {bookings?.length > 0 && bookings.map(booking => (
                <Link to={`/account/bookings/${booking.id}`} className='flex gap-4 mt-4 bg-gray-200 rounded-2xl overflow-hidden shadow-md shadow-gray-500'>
                    <div className='w-48 h-48'>
                        <PlaceImg place={booking.place} />
                    </div>
                    <div className='py-3 pr-3 grow'>
                        <h2 className='text-xl'>{booking.place.title}</h2>
                        <div className='border-t text-gray-600 border-gray-300 mt-2 py-2'>
                            {format(new Date(booking.checkIn), 'yyyy-mm-dd')} - {format(new Date(booking.checkOut), 'yyyy-mm-dd')}
                        </div>
                        <div className=''>
                            {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights
                            | Total price: ${booking.price}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default BookingsPage
