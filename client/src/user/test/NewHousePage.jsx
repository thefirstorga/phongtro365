import React, { useState } from 'react';
import AddressPickerMap from './AddressPickerMap'; // Import component bản đồ

const NewHousePage = () => {
  const [showMap, setShowMap] = useState(false); // Trạng thái hiển thị bản đồ
  const [selectedPosition, setSelectedPosition] = useState(null); // Lưu tọa độ đã chọn

  const handleSavePosition = (position) => {
    setSelectedPosition(position);
    setShowMap(false); // Đóng popup sau khi lưu
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => setShowMap(true)}
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Chọn địa chỉ trên bản đồ
        </button>
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
    </div>
  );
};

export default NewHousePage;
