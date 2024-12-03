import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { BASE_URL } from '../../config';

function InvoiceDetailRenter({ bookingId }) {
    const [invoices, setInvoices] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);  // To store the selected invoice
    const [showImageModal, setShowImageModal] = useState(false);  // To show image modal
    const [selectedImage, setSelectedImage] = useState(null);  // To store the selected image for modal


    // Hiển thị chi tiết hóa đơn
    const viewInvoiceDetail = (invoice) => {
        setSelectedInvoice(invoice);  // Set the selected invoice to show details
        setShowInvoice(true);  // Show the invoice detail form
    };

    // Mở ảnh trong modal
    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);  // Set the selected image URL
        setShowImageModal(true);  // Show the image modal
    };

    // Đóng modal ảnh
    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);  // Clear the selected image
    };

    // Đóng modal chi tiết hóa đơn
    const closeInvoiceModal = () => {
        setShowInvoice(false);
        setSelectedInvoice(null);  // Clear selected invoice
    };

    // Lấy ra hóa đơn
    useEffect(() => {
        axios.get(`/booking/getinvoices/${bookingId}`)
            .then(response => {
                setInvoices(response.data);
            })
            .catch(error => {
                console.error('Error fetching invoices:', error);
            });
    }, [bookingId]);

    return (
        <div>
            {/* Modal cho chi tiết hóa đơn */}
            {showInvoice && selectedInvoice && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40" onClick={closeInvoiceModal}>
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full md:max-w-lg lg:max-w-3xl" onClick={(e) => e.stopPropagation()}>
                        <p className="text-xl font-bold mt-4">Title: {selectedInvoice.title}</p>
                        <p>Description: {selectedInvoice.description}</p>
                        <p>Photos:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                            {selectedInvoice.photos?.map(photo => (
                                <div key={photo.id} className="relative">
                                    <img
                                        src={BASE_URL+photo.url}
                                        alt={photo.url}
                                        className="w-full h-32 object-cover rounded-lg cursor-pointer"
                                        onClick={() => openImageModal(BASE_URL+photo.url)}  // Open modal when image is clicked
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={closeInvoiceModal}
                            className="absolute right-4 top-4 flex gap-1 py-2 px-4 rounded-2xl shadow-sm bg-white text-black"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Modal cho ảnh */}
            {showImageModal && selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={closeImageModal}>
                    <div className="relative z-50">
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="max-w-3xl max-h-[90vh] object-contain"
                        />
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 bg-white p-2 rounded-full text-black"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Danh sách hóa đơn */}
            <div>
                <div className='space-y-3'>
                    <p className='font-bold text-xl text-gray-800 mt-4'>Danh sách hóa đơn các tháng</p>
                    {invoices.length && invoices.map(invoice => (
                        <div key={invoice.id} className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                            <p className="font-bold">{invoice.title}</p>
                            <p>{invoice.description}</p>
                            <button onClick={() => viewInvoiceDetail(invoice)} className="mt-2 text-blue-500">Xem chi tiết</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InvoiceDetailRenter
