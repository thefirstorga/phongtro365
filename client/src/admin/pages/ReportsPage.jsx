import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceDetailsPopup from '../components/PlaceDetailPopup';

function ReportsPage() {
    const [places, setPlaces] = useState([]);
    const [pendingReports, setPendingReports] = useState([]);
    const [normalPlaces, setNormalPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null); // Popup chi tiết nhà
    const [selectedReports, setSelectedReports] = useState(null); // Popup xem report

    useEffect(() => {
        axios.get('/admin-api/get-places')
            .then(response => {
                const allPlaces = response.data.places || [];

                // Lọc các nhà có report PENDING
                const placesWithPendingReports = allPlaces
                    .map(place => ({
                        ...place,
                        pendingReportCount: place.reports.filter(report => report.status === 'PENDING').length
                    }))
                    .filter(place => place.pendingReportCount > 0)
                    .sort((a, b) => b.pendingReportCount - a.pendingReportCount);

                // Lọc các nhà không bị báo cáo hoặc không có report PENDING
                const normalPlaces = allPlaces.filter(
                    place => 
                        place.status !== 'DELETE' && // Loại bỏ những nhà có trạng thái DELETE
                        place.reports.every(report => report.status !== 'PENDING') // Loại bỏ những nhà có report trạng thái PENDING
                );                

                setPlaces(allPlaces);
                setPendingReports(placesWithPendingReports);
                setNormalPlaces(normalPlaces);
            })
            .catch(error => {
                console.error('Error fetching places:', error);
            });
    }, []);

    // Đóng popup xem report
    const closeReportsPopup = () => {
        setSelectedReports(null);
    };

    // Đóng popup xem chi tiết nhà
    const closeDetailsPopup = () => {
        setSelectedPlace(null);
    };

    const handleDeletePlace = async (placeId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa ngôi nhà này?')) {
            try {
                const response = await axios.post(`/admin-api/delete-place/${placeId}`);
                alert(response.data.message || 'Ngôi nhà đã được xóa.');
    
                window.location.reload()
            } catch (error) {
                console.error('Error deleting place:', error);
                alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa ngôi nhà.');
            }
        }
    };

    const handleMarkAsNormal = async (placeId) => {
        if (window.confirm('Bạn có chắc chắn rằng nhà này không vi phạm?')) {
            try {
                const response = await axios.post(`/admin-api/mark-place-normal/${placeId}`);
                alert(response.data.message || 'Ngôi nhà đã được đánh dấu là bình thường.');
    
                window.location.reload()
            } catch (error) {
                console.error('Error marking place as normal:', error);
                alert(error.response?.data?.message || 'Có lỗi xảy ra khi đánh dấu nhà này.');
            }
        }
    };
    
    

    return (
        <div>
            <h1 className="text-2xl font-bold my-4">Danh sách nhà đang bị report</h1>
            {/* Phần hiển thị nhà bị report (PENDING) */}
            {pendingReports.length > 0 ? (
                <div className="space-y-4">
                    {pendingReports.map(place => (
                        <div key={place.id} className="border p-4 rounded shadow-md bg-gray-100 flex justify-between items-center">
                            <div>
                                {/* Click vào tên nhà mở popup chi tiết nhà */}
                                <h2
                                    className="text-xl font-semibold cursor-pointer hover:underline"
                                    onClick={() => setSelectedPlace(place)}
                                >
                                    {place.title}
                                </h2>
                                <p>Địa chỉ: {place.address}</p>
                                <p>Số người report: {place.pendingReportCount}</p>
                            </div>
                            {/* Các nút hành động */}
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => setSelectedReports(place.reports)}
                                >
                                    Xem report
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => handleDeletePlace(place.id)}
                                >
                                    Xóa nhà này
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    onClick={() => handleMarkAsNormal(place.id)}
                                >
                                    Đánh dấu bình thường
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Không có nhà nào đang bị báo cáo.</p>
            )}

            <h1 className="text-2xl font-bold mt-8 mb-4">Danh sách nhà đang hoạt động</h1>
            {/* Phần hiển thị nhà bình thường */}
            {normalPlaces.length > 0 ? (
                <div className="space-y-4">
                    {normalPlaces.map(place => (
                        <div key={place.id} className="border p-4 rounded shadow-md bg-gray-100">
                            {/* Click vào tên nhà mở popup chi tiết nhà */}
                            <h2
                                className="text-xl font-semibold cursor-pointer hover:underline"
                                onClick={() => setSelectedPlace(place)}
                            >
                                {place.title}
                            </h2>
                            <p>Địa chỉ: {place.address}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Không có nhà bình thường nào.</p>
            )}

            {/* Popup chi tiết nhà */}
            {selectedPlace && (
                <PlaceDetailsPopup
                    place={selectedPlace}
                    onClose={closeDetailsPopup}
                />
            )}

            {/* Popup xem report */}
            {selectedReports && (
                <div
                    id="popup-overlay"
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={(e) => e.target.id === 'popup-overlay' && closeReportsPopup()}
                >
                    <div className="bg-white p-6 rounded shadow-md w-96 max-h-[90%] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Danh sách report</h2>
                        <ul className="space-y-2">
                            {selectedReports.map(report => (
                                <li key={report.id} className="border-b pb-2">
                                    <p><strong>Người báo cáo:</strong> {report.reporter.name} ({report.reporter.email})</p>
                                    <p><strong>Số điện thoại:</strong> {report.reporter.phone}</p>
                                    <p><strong>Lý do:</strong> {report.reason}</p>
                                    <p><strong>Trạng thái:</strong> {report.status}</p>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={closeReportsPopup}
                            className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportsPage;
