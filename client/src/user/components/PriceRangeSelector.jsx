import React, { useState } from "react";
import { Range } from "react-range";

const PriceRangeSelector = ({ minPrice, maxPrice, onChange }) => {
  const [values, setValues] = useState([minPrice, maxPrice]); // Giá trị ban đầu từ props

  const handleRangeChange = (newValues) => {
    setValues(newValues);
    if (onChange) {
      onChange(newValues); // Gửi giá trị mới lên component cha
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 px-4 pb-2">
      {/* Hiển thị giá trị nhỏ nhất và lớn nhất */}
      <div className="flex justify-between w-full text-sm font-medium">
        <span>{values[0].toLocaleString()} triệu</span>
        <span>{values[1].toLocaleString()} triệu</span>
      </div>

      {/* Thanh kéo giá */}
      <Range
        step={0.1} // Bước giá trị di chuyển
        min={minPrice}
        max={maxPrice}
        values={values}
        onChange={handleRangeChange}
        renderTrack={({ props, children, key }) => (
          <div
            key={key}
            {...props}
            className="w-full h-2 bg-gray-200 rounded-lg z-0"
            style={{
              ...props.style,
              background: `linear-gradient(to right, #d1d5db ${
                ((values[0] - minPrice) / (maxPrice - minPrice)) * 100
              }%, #f43f5e ${
                ((values[0] - minPrice) / (maxPrice - minPrice)) * 100
              }%, #f43f5e ${
                ((values[1] - minPrice) / (maxPrice - minPrice)) * 100
              }%, #d1d5db ${
                ((values[1] - minPrice) / (maxPrice - minPrice)) * 100
              }%)`,
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, key }) => (
          <div key={key}
            {...props}
            className="w-4 h-4 bg-pink-500 rounded-full shadow-md focus:outline-none"
          />
        )}
      />
    </div>
  );
};

export default PriceRangeSelector;
