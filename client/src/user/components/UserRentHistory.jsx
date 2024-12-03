import React, { useState } from 'react';
import InvoiceDetailRenter from './InvoiceDetailRenter';

function UserRentHistory({ rentHistory }) {
    const [selectedBooking, setSelectedBooking] = useState(null); // Lưu booking được chọn
    const [showBookingPopup, setShowBookingPopup] = useState(false); // Popup chi tiết booking

    const handleOpenBookingPopup = (booking) => {
        setSelectedBooking(booking);
        setShowBookingPopup(true);
    };

    const handleCloseBookingPopup = () => setShowBookingPopup(false);

    return (
        <div className="mt-4 bg-gray-100 px-8 py-8 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Lịch sử thuê phòng của bạn</h2>
            <p className="text-gray-700">Tổng số lần thuê: {rentHistory.length}</p>
            <div className="space-y-4 mt-4">
                {rentHistory.map((booking, index) => (
                    <div
                        key={booking.id}
                        className="p-4 border rounded-lg flex justify-between items-center shadow-md"
                    >
                        <div>
                            <p className="font-semibold">
                                Lần thuê thứ {index + 1}
                            </p>
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

            {/* Popup chi tiết booking */}
            {showBookingPopup && selectedBooking && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={handleCloseBookingPopup} // Đóng khi click bên ngoài popup
                >
                    <div
                        className="bg-white p-6 w-full mx-80 rounded-lg relative"
                        onClick={(e) => e.stopPropagation()} // Ngăn việc đóng popup khi click vào nội dung bên trong
                    >
                        <h3 className="text-2xl font-bold mb-4">Chi tiết booking</h3>
                        <div>
                            {selectedBooking.invoices.length > 0 ? (
                                <InvoiceDetailRenter bookingId={selectedBooking.id}/>
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

export default UserRentHistory;
