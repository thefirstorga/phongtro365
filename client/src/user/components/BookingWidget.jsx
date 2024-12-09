import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import {UserContext} from './UserContext'

function BookingWidget({place}) {

    const [redirect, setRedirect] = useState('')
    const {user} = useContext(UserContext)
    const [isBooked, setIsBooked] = useState(false)

    useEffect(() => {
        if (user && user.id) {
            const userBooking = place?.bookings?.find(booking => booking.renterId === user.id && booking.status === 'PENDING')
            setIsBooked(!!userBooking)
        }
    }, [place.bookings, user])

    // không hiểu sao viết như này lại không được:)))

    // useEffect(() => {
    //     const userBooking = place?.bookings?.find(booking => booking.userId === user.id) 
    //     if (userBooking) {
    //         setIsBooked(true)
    //     } else {
    //         setIsBooked(false)
    //     }
    // }, [place.bookings, user])

    async function bookThisPlace() {
        const data = {
            placeId: place.id,
        }
        const response = await axios.post('/booking', data)
        window.location.reload()
    }

    async function cancelBooking() {
        const data = {
            placeId: place.id
        }
        try {
            await axios.post('/booking/cancel-booking', data) // API hủy booking
            setIsBooked(false) // Cập nhật trạng thái là chưa đặt phòng
            window.location.reload()
        } catch (error) {
            console.error("Cancellation failed:", error)
        }
    }


    if(redirect) return <Navigate to={redirect} />

  return (
    <div className='bg-white shadow-sm p-4 rounded-2xl'>
        <div className='text-xl text-center'>
            <b>{place.price}</b> triệu/tháng
        </div>
        {!isBooked ? (
                <button onClick={bookThisPlace} className='primary mt-4'>
                    <b>Book nhà này</b>
                </button>
            ) : (
                <button onClick={cancelBooking} className='primary mt-4'>
                    Hủy đặt
                </button>
            )}
    </div>
  )
}

export default BookingWidget
