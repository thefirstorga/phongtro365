import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import PlaceGallery from '../components/PlaceGallery'
import BookingWidget from '../components/BookingWidget'

function BookingPage() {
    const {id} = useParams()
    const [booking, setBooking] = useState(null)
    let place = null
    useEffect(() => {
        if(id) {
            const idNumber = Number(id);
            axios.get('/booking').then(response => {
                const foundBooking = response.data.find(({id}) => id === idNumber)
                console.log(foundBooking)
                if(foundBooking) setBooking(foundBooking)
            })
        }
    }, [id])

    if(!booking) return ''
    else {
        place = booking.place
    }
  return (
    <div className='mt-4 bg-gray-100 -mx-8 px-8 py-8'>
        <h1 className='text-3xl'>{place.title}</h1>
        <a className='flex gap-1 my-2 font-semibold underline' target='_blank' href={'https://maps.google.com/?q='+place.address}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {place.address}
        </a>
        <div className='bg-gray-200 p-6 mb-6 rounded-2xl'>
            <h2 className='text-xl font-bold'>Your booking infomation:</h2>
            {/* <div className='border-t text-gray-600 border-gray-300 mt-2 py-2'>
                {format(new Date(booking.checkIn), 'yyyy-mm-dd')} - {format(new Date(booking.checkOut), 'yyyy-mm-dd')}
            </div>
            <div className=''>
                {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights
                | Total price: ${booking.price}
            </div> */}
            <div>
                Oke built it later
            </div>
        </div>

        <PlaceGallery place={place} />
      
        <div className='mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]'>
            <div>
                <div className='my-4'>
                    <h2 className='font-semibold text-2xl'>Description</h2>
                    {place.description}
                </div>
            </div>
            <div>
                <BookingWidget place={place} />
            </div>
        </div>
        <div className="bg-white -mx-8 px-8 py-8 border-t">
            <div>
                <h2 className='font-semibold text-2xl'>Extra Info</h2>
            </div>
            <div className='mb-4 mt-2 text-sm text-gray-800 leading-5'>
                {place.extraInfo}
            </div>
        </div>
    </div>
  )
}

export default BookingPage
