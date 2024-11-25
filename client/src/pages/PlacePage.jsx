import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookingWidget from '../components/BookingWidget';
import PlaceGallery from '../components/PlaceGallery';
import { UserContext } from '../components/UserContext';
import PlaceDetail from './PlaceDetail';
import { differenceInCalendarMonths, differenceInDays, format } from 'date-fns';
import InvoiceDetailRenter from '../components/InvoiceDetailRenter';
import MapComponent from '../components/MapComponent';

function PlacePage() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [place, setPlace] = useState(null);
    // bookingDetail là biến mà lưu state booking của người đang đăng nhập
    const [bookingDetail, setBookingDetail] = useState(null);

    // useEffect for fetching place data
    useEffect(() => {
        if (!id) return;
        axios.get(`/post/place/${id}`)
            .then(response => {
                setPlace(response.data.place);
            })
            .catch(error => {
                console.error("There was an error fetching the place data!", error);
            });
    }, [id])
    
    // useEffect for checking booking details only after place data is loaded
    useEffect(() => {
        if (user && user.id && place?.bookings) {
            const userBooking = place.bookings.find(booking => booking.renterId === user.id && booking.status !== 'RENTED');
            setBookingDetail(userBooking);
        }
    }, [place?.bookings, user]);

    async function continueRent(ev, bookingId, placeId) {
        ev.preventDefault();
        const data = { bookingId, placeId };
        await axios.put('/booking/continue-rent', data)
        window.location.reload()
    }

    async function notContinueRent(ev, bookingId) {
        ev.preventDefault();
        const data = {bookingId}
        await axios.put('/booking/not-continue-rent', data)
        window.location.reload()
    }

    async function notRentRequest(ev, bookingId) {
        ev.preventDefault();
        const data = {bookingId}
        await axios.put('/booking/not-rent-request', data)
        window.location.reload()
    }

    async function undoNotRentRequest(ev, bookingId) {
        ev.preventDefault();
        const data = {bookingId}
        await axios.put('/booking/undo-not-rent-request', data)
        window.location.reload()
    }
    // console.log(bookingDetail)

    let rentInfo = null
    let bookingWidget = (
        <div>
            <BookingWidget place={place} />
        </div>
    )
    let option = null

    if (!place && !bookingDetail) {
        return <div>Loading place data...</div>
    } else {
        if(user.id === place.ownerId) {
            return <PlaceDetail/>
        }
        let bookingNow = place.bookings.find(booking => booking.status === "APPROVED") || place.bookings.find(booking => booking.status === "WAIT")// dòng này tìm xem có cái nào approved không
        // console.log(bookingNow)
        if(place.bookings.length !== 0 && 
            bookingNow !== undefined 
        ) {
            const today = new Date();
            const checkOutDate = new Date(bookingNow.checkOut);
            const monthsRemaining = differenceInCalendarMonths(checkOutDate, today);

            if(monthsRemaining > 0) {
                bookingWidget = null
                rentInfo = (
                    <div className='bg-gray-200 p-6 mb-6 rounded-2xl'>
                        <h2 className='text-xl font-bold text-primary'>
                            Nhà này đang có người thuê!
                        </h2>
                    </div>
                )
            } else {
                rentInfo = (
                    <div className='bg-gray-200 p-6 mb-6 rounded-2xl'>
                        <h2 className='text-xl font-bold text-primary'>
                            Nhà này đang có người thuê!
                        </h2>
                        <h2 className='font-bold'> - Tuy nhiên họ chưa xác nhận ở tiếp trong vòng 1 tháng nữa, bạn vẫn có thể đặt thuê nhà này!</h2>
                        <h2 className='font-bold'> - Bạn có thể kéo xuống và đặt trước nhà này.</h2>
                    </div>
                )
            }
        }
        if(bookingDetail != null) {
            if(bookingDetail.status === 'PENDING') {
                rentInfo = (
                    <div className='bg-gray-200 p-6 mb-6 rounded-2xl'>
                        <h2 className='text-xl font-bold text-primary'>Your booking information:</h2>
                        <div>
                            Bạn đã đặt phòng, vui lòng chờ chủ nhà duyệt nhé! <br />
                            Bạn vẫn có thể hủy booking!
                        </div>
                    </div>
                )
            }
            if(bookingDetail.status === 'APPROVED') {
                const today = new Date();
                const checkOutDate = new Date(bookingDetail.checkOut);
                const monthsRemaining = differenceInCalendarMonths(checkOutDate, today);
                const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + monthsRemaining, 1);
                const remainingDaysInMonth = differenceInDays(checkOutDate, startOfNextMonth);

                if(monthsRemaining === 0 
                    && bookingDetail.isContinue === false
                ) {
                    option = (
                        <div>
                            <p className="text-lg font-semibold text-gray-800">Bạn có thể chọn ở tiếp nhà này.</p>
                            <button onClick={(ev) => continueRent(ev, bookingDetail.id, id)} className="primary">Tiếp tục ở</button>
                            <button onClick={(ev) => notContinueRent(ev, bookingDetail.id)} className="mt-2 primary">Không tiếp tục ở</button>
                        </div>
                    )
                    console.log("option")
                } else if(bookingDetail.isContinue === true) {
                    option = (
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                Bạn đã xác nhận không ở tiếp nữa. <br />
                                Bạn có thể hủy thuê nhà ở đây.
                            </p>
                        </div>
                    )
                }

                rentInfo = (
                    <div>
                        <div className='bg-gray-200 p-6 mb-6 rounded-2xl'>
                            <div className='space-y-3'>
                                <h2 className='text-xl font-bold text-primary'>Bạn đang thuê nhà này!</h2>
                                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold text-gray-800">Thời hạn hợp đồng:</p>
                                    <p className="text-gray-600">{format(checkOutDate, 'dd-MM-yyyy')}</p>
                                </div>
                                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold text-gray-800">Thời gian còn lại:</p>
                                    <p className="text-gray-600">{monthsRemaining} tháng và {remainingDaysInMonth} ngày</p>
                                </div>
                                {option}
                                <button onClick={(ev) => notRentRequest(ev, bookingDetail.id)} className="primary">Hủy thuê nhà</button>
                            </div>
                            <InvoiceDetailRenter bookingId={bookingDetail.id} />
                        </div>
                    </div>
                )
                bookingWidget = null
            }
            if(bookingDetail.status === 'WAIT') {
                const today = new Date();
                const checkOutDate = new Date(bookingDetail.checkOut);
                const monthsRemaining = differenceInCalendarMonths(checkOutDate, today);
                const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + monthsRemaining, 1);
                const remainingDaysInMonth = differenceInDays(checkOutDate, startOfNextMonth);

                // if(monthsRemaining === 0 
                //     && bookingDetail.isContinue === false
                // ) {
                //     option = (
                //         <div>
                //             <p className="text-lg font-semibold text-gray-800">Bạn có thể chọn ở tiếp nhà này.</p>
                //             <button onClick={(ev) => continueRent(ev, bookingDetail.id, id)} className="primary">Tiếp tục ở</button>
                //             <button onClick={(ev) => notContinueRent(ev, bookingDetail.id)} className="mt-2 primary">Không tiếp tục ở</button>
                //         </div>
                //     )
                //     console.log("option")
                // } else if(bookingDetail.isContinue === true) {
                //     option = (
                //         <div>
                //             <p className="text-lg font-semibold text-gray-800">
                //                 Bạn đã xác nhận không ở tiếp nữa. <br />
                //                 Bạn có thể hủy thuê nhà ở đây.
                //             </p>
                //         </div>
                //     )
                // }

                rentInfo = (
                    <div>
                        <div className='bg-gray-200 p-6 mb-6 rounded-2xl'>
                            <div className='space-y-3'>
                                <h2 className='text-xl font-bold text-primary'>Bạn đang thuê nhà này!</h2>
                                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold text-gray-800">Thời hạn hợp đồng:</p>
                                    <p className="text-gray-600">{format(checkOutDate, 'dd-MM-yyyy')}</p>
                                </div>
                                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold text-gray-800">Thời gian còn lại:</p>
                                    <p className="text-gray-600">{monthsRemaining} tháng và {remainingDaysInMonth} ngày</p>
                                </div>
                                <h2 className='text-xl font-bold text-primary'>Bạn đã hủy thuê nhà!</h2>
                                <button onClick={(ev) => undoNotRentRequest(ev, bookingDetail.id)} className="primary">Hoàn tác hủy thuê nhà</button>
                            </div>
                            <InvoiceDetailRenter bookingId={bookingDetail.id} />
                        </div>
                    </div>
                )
                bookingWidget = null
            }
        }
    }


    return (
        // <div className='mt-4 bg-gray-100 -mx-8 px-8 py-8 rounded-3xl'>
        //     {/* Show booking status if it exists */}
        //     {/* <div className='border-b-2'>
        //         {rentInfo && rentInfo}
        //     </div> */}
        //     {rentInfo && (
        //         <div className='border-b-2'>
        //             {rentInfo && rentInfo}
        //         </div>
        //     )}
        //     <h1 className='text-3xl mt-4'>{place.title}</h1>
        //     <a className='flex gap-1 my-2 font-semibold underline' target='_blank' href={'https://maps.google.com/?q=' + place.address}>
        //         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        //             <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        //             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        //         </svg>
        //         {place.address}
        //     </a>

        //     <PlaceGallery place={place} />

        //     <div className='mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]'>
        //         <div>
        //             <div className='my-4'>
        //                 <h2 className='font-semibold text-2xl'>Description</h2>
        //                 {place.description}
        //             </div>
        //             Area: {place.area}<br />
        //             Duration: {place.duration}<br />
        //             Price: {place.price}
        //         </div>
        //         {bookingWidget}
        //     </div>
        //     <div className="bg-white -mx-8 px-8 py-8 border-t">
        //         <div>
        //             <h2 className='font-semibold text-2xl'>Extra Info</h2>
        //         </div>
        //         <div className='mb-4 mt-2 text-sm text-gray-800 leading-5'>
        //             {place.extraInfo}
        //         </div>
        //     </div>
        // </div>
        <div>
            {/* Content Based on Booking Status */}
            {rentInfo && (<div className='mt-10 bg-gray-100 px-8 py-8 rounded-lg shadow-md'>
                {rentInfo}
            </div>)}
            {/* Place Details Section */}
            <div className="mt-4 bg-gray-100 px-8 py-8 rounded-lg shadow-md">
                <div className='flex gap-4 items-center'>
                    <h1 className="text-3xl font-semibold text-gray-800">{place.title}</h1>
                </div>
                <div className='flex gap-6 my-2'>
                    <p className='flex gap-1 my-2 font-semibold'>
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
                        target='_blank'
                        rel='noopener noreferrer'
                        href={'https://maps.google.com/?q=' + place.address}
                    >
                        Xem trên Google Map
                    </a>
                </div>
                
                <PlaceGallery place={place} />
            </div>

            {/* thông tin chủ trọ */}
            <div className="mt-4 bg-gray-100 px-8 py-8 rounded-lg shadow-md">
                <div className="my-4">
                    <h2 className="font-semibold text-2xl text-gray-800 mb-6">Thông tin chủ nhà</h2>

                    {/* Hàng 1: Ảnh và tên */}
                    <div className="flex items-center mb-6 ml-4">
                    <a
                        href={`/profile/${place.owner.id}`} // Đường dẫn đến trang cá nhân
                        className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 shadow-lg flex-shrink-0"
                    >
                        <img
                        src={
                            place.owner.avatar
                            ? `http://localhost:4000/post/uploads/${place.owner.avatar}`
                            : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        />
                    </a>
                    <div className="ml-6">
                        <a
                        href={`/profile/${place.owner.id}`} // Đường dẫn đến trang cá nhân
                        className="text-lg font-semibold text-gray-800 hover:underline"
                        >
                        {place.owner.name}
                        </a>
                    </div>
                    </div>

                    {/* Hàng 2: Số điện thoại và Zalo */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="relative ml-8">
                            <p className="text-gray-600 font-semibold">Số điện thoại</p>
                            <div className="flex items-center">
                            <p className="text-gray-800 font-medium">{place.owner.phone}</p>
                            <button
                                onClick={() => navigator.clipboard.writeText(place.owner.phone)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                                title="Copy số điện thoại"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                </svg>
                            </button>
                            </div>
                        </div>
                        <div className="relative">
                            <p className="text-gray-600 font-semibold">Zalo</p>
                            <div className="flex items-center">
                            <p className="text-gray-800 font-medium">{place.owner.zalo}</p>
                            <button
                                onClick={() => navigator.clipboard.writeText(place.owner.zalo)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                                title="Copy Zalo"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                </svg>
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Place Description and Details */}
            <div className='mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr] p-6 rounded-lg shadow-md bg-gray-100'>
                <div>
                    <div className='my-4'>
                        <h2 className='font-semibold text-2xl'>Description</h2>
                        {place.description}
                    </div>
                    Area: {place.area}<br />
                    Duration: {place.duration}<br />
                    Price: {place.price}
                </div>
                {bookingWidget}
            </div>

            {/* Extra Info Section */}
            <div className="bg-gray-100 px-8 py-8 border-t mt-6 rounded-lg shadow-md">
                <h2 className="font-semibold text-2xl text-gray-800">Thông tin thêm</h2>
                <p className="text-gray-600 mt-4 leading-6">{place.extraInfo}</p>
            </div>

            {/* History section */}
            {/* {historyRent} */}
        </div>
    );
}

export default PlacePage;
