import React, { useState } from 'react';
import AddressPickerMap from '../components/AddressPickerMap'; // Import component bản đồ

const NewHousePage = () => {
  const [showMap, setShowMap] = useState(false); // Trạng thái hiển thị bản đồ
  const [selectedPosition, setSelectedPosition] = useState(null); // Lưu tọa độ đã chọn

  const handleSavePosition = (position) => {
    setSelectedPosition(position);
    setShowMap(false); // Đóng popup sau khi lưu
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tạo Nhà Mới</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Địa chỉ:
        </label>
        <button
          onClick={() => setShowMap(true)}
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Chọn Địa Chỉ
        </button>
        {selectedPosition && (
          <div className="mt-2 text-sm text-gray-700">
            Tọa độ đã chọn: {selectedPosition[0]}, {selectedPosition[1]}
          </div>
        )}
      </div>
      {showMap && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4">
            <AddressPickerMap
                initialPosition={selectedPosition}
              onSave={handleSavePosition}
              onClose={() => setShowMap(false)}
            />
          </div>
        </div>
      )}
      <button className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">
        Lưu Nhà
      </button>
    </div>
  );
};

export default NewHousePage;
