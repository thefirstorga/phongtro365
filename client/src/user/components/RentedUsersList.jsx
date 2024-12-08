import React, { useState } from 'react';
import { BASE_URL } from '../../config';
import InvoiceDetailRenter from './InvoiceDetailRenter';
import { Link } from 'react-router-dom';

function RentedUsersList({ bookingRented }) {
    const [selectedBooking, setSelectedBooking] = useState(null); // Lưu booking được chọn
    const [showUserPopup, setShowUserPopup] = useState(false); // Popup người thuê
    const [showBookingPopup, setShowBookingPopup] = useState(false); // Popup chi tiết booking

    const handleOpenUserPopup = () => setShowUserPopup(true);
    const handleCloseUserPopup = () => setShowUserPopup(false);
    const handleOpenBookingPopup = (booking) => {
        setSelectedBooking(booking);
        setShowBookingPopup(true);
    };
    const handleCloseBookingPopup = () => setShowBookingPopup(false);

    return (
        <div className="bg-gray-100 px-8 py-8 border-t mt-6 rounded-lg shadow-md">
            <h2 className="font-semibold text-2xl text-gray-800">Lượt đã thuê</h2>
            <p className="text-gray-700">Số lượng: {bookingRented.length}</p>
            <button
                onClick={handleOpenUserPopup}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
            >
                Xem chi tiết
            </button>

            {/* Popup người thuê */}
            {showUserPopup && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={handleCloseUserPopup} // Đóng khi click bên ngoài popup
                >
                    <div
                        className="bg-white w-full lg:mx-96 mx-4 p-6 rounded-lg relative"
                        onClick={(e) => e.stopPropagation()} // Ngăn việc đóng popup khi click vào nội dung bên trong
                    >
                        <h3 className="text-2xl font-bold mb-4">Danh sách người thuê</h3>
                        <div className="space-y-4 mb-3">
                            {bookingRented.map((booking) => (
                                <div key={booking.id} className="flex items-center border-t-2 mb-2 pt-4">
                                    <Link to={`/profile/${booking.renter.id}`}>
                                        <img
                                            src={
                                                booking.renter?.avatar
                                                  ? BASE_URL + booking.renter?.avatar
                                                  : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'
                                              }
                                            alt={booking.renter.avatar}
                                            className="w-12 h-12 rounded-full mr-3"
                                        />
                                    </Link>
                                    <div className="flex-grow">
                                        <a href={`/profile/${booking.renter.id}`} className="text-lg font-semibold text-gray-800 hover:underline">
                                            {booking.renter.name}
                                        </a>
                                        <p className="text-sm text-gray-500">
                                            Từ {new Date(booking.createAt).toLocaleDateString()} đến{' '}
                                            {new Date(booking.checkOut).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenBookingPopup(booking)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Popup chi tiết booking */}
            {showBookingPopup && selectedBooking && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={handleCloseBookingPopup} // Đóng khi click bên ngoài popup
                >
                    <div
                        className="bg-white p-6 w-full lg:mx-[400px] mx-8 rounded-lg relative"
                        onClick={(e) => e.stopPropagation()} // Ngăn việc đóng popup khi click vào nội dung bên trong
                    >
                        <h3 className="text-2xl font-bold mb-4">Chi tiết booking</h3>
                        <div>
                            {selectedBooking.invoices.length > 0 ? (
                                <InvoiceDetailRenter bookingId={selectedBooking.id} />
                            ) : (
                                <p className="text-gray-500">Không có hóa đơn nào.</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <h4 className="font-bold text-gray-700 mb-2">Bình luận:</h4>
                            {selectedBooking.comments.length > 0 ? (
                                <ul className="space-y-2">
                                    {selectedBooking.comments.map((comment) => (
                                        <li key={comment.id}>
                                            <p className="text-gray-800">{comment.content}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Không có bình luận nào.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RentedUsersList;
