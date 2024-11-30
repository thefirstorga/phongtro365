import React from 'react'

function ListHome() {
  return (
    <div className="p-8">
    {/* Title */}
    <h1 className="text-2xl font-semibold mb-6">Bạn muốn tìm nhà trọ?</h1>

    {/* Search Filters */}
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center mb-8">
      <select className="px-4 py-2 border border-gray-300 rounded-md">
        <option>Hãy chọn địa điểm</option>
        {/* Các tùy chọn địa điểm khác */}
      </select>
      <select className="px-4 py-2 border border-gray-300 rounded-md">
        <option>Hãy chọn mức giá</option>
        {/* Các tùy chọn mức giá khác */}
      </select>
      <select className="px-4 py-2 border border-gray-300 rounded-md">
        <option>Hãy chọn loại nhà</option>
        {/* Các tùy chọn loại nhà khác */}
      </select>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
        Tìm kiếm
        <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.9 14.32a8 8 0 111.414-1.415l4.387 4.387a1 1 0 01-1.414 1.415l-4.387-4.387zM10 16a6 6 0 100-12 6 6 0 000 12z" />
        </svg>
      </button>
    </div>

    {/* Room Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card 1 */}
      <div className="flex bg-gray-200 rounded-lg overflow-hidden shadow-md">
        <div className="bg-gray-600 w-1/4 h-full"></div>
        <div className="p-4 flex flex-col justify-between w-3/4">
          <div>
            <h2 className="text-lg font-semibold">Phòng trọ vskk</h2>
            <p className="text-red-500 text-sm mb-2">2tr/tháng</p>
            <p className="text-sm text-gray-700">Đầy đủ trang bị, thiết bị, tiện nghi, ...</p>
          </div>
          <label className="flex items-center mt-4">
            <div className="w-16 h-16 bg-white rounded-full mr-4 flex-shrink-0"></div>
            <span className="text-sm">Tên chủ trọ</span>
          </label>
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex bg-gray-200 rounded-lg overflow-hidden shadow-md">
        <div className="bg-red-300 w-1/4 h-full"></div>
        <div className="p-4 flex flex-col justify-between w-3/4">
          <div>
            <h2 className="text-lg font-semibold">Phòng trọ 2N1K</h2>
            <p className="text-red-500 text-sm mb-2">2tr/tháng</p>
            <p className="text-sm text-gray-700">Đầy đủ trang bị, thiết bị, tiện nghi, ...</p>
          </div>
          <label className="flex items-center mt-4">
            <div className="w-16 h-16 bg-white rounded-full mr-4 flex-shrink-0"></div>
            <span className="text-sm">Tên chủ trọ</span>
          </label>
        </div>
      </div>

      {/* Card 3 */}
      <div className="flex bg-gray-200 rounded-lg overflow-hidden shadow-md">
        <div className="bg-teal-600 w-1/4 h-full"></div>
        <div className="p-4 flex flex-col justify-between w-3/4">
          <div>
            <h2 className="text-lg font-semibold">Còn phòng trống</h2>
            <p className="text-red-500 text-sm mb-2">2tr/tháng</p>
            <p className="text-sm text-gray-700">Đầy đủ trang bị, thiết bị, tiện nghi, ...</p>
          </div>
          <label className="flex items-center mt-4">
            <div className="w-16 h-16 bg-white rounded-full mr-4 flex-shrink-0"></div>
            <span className="text-sm">Tên chủ trọ</span>
          </label>
        </div>
      </div>

      {/* Card 4 */}
      <div className="flex bg-gray-200 rounded-lg overflow-hidden shadow-md">
        <div className="bg-yellow-700 w-1/4 h-full"></div>
        <div className="p-4 flex flex-col justify-between w-3/4">
          <div>
            <h2 className="text-lg font-semibold">Phòng trọ nhỏ 1 người ở</h2>
            <p className="text-red-500 text-sm mb-2">2tr/tháng</p>
            <p className="text-sm text-gray-700">Đầy đủ trang bị, thiết bị, tiện nghi, ...</p>
          </div>
          <label className="flex items-center mt-4">
            <div className="w-16 h-16 bg-white rounded-full mr-4 flex-shrink-0"></div>
            <span className="text-sm">Tên chủ trọ</span>
          </label>
        </div>
      </div>
    </div>
    </div>
  )
}

export default ListHome
