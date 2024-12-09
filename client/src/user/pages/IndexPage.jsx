import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PriceRangeSelector from "../components/PriceRangeSelector";
import MapIndexPage from "../components/MapIndexPage";
import { BASE_URL } from "../../config";
import PlaceImg from "../components/PlaceImg";

function IndexPage() {
  const [places, setPlaces] = useState([]); // Tất cả places từ API
  const [filteredPlaces, setFilteredPlaces] = useState([]); // Places sau khi lọc
  const [selectedAddress, setSelectedAddress] = useState(""); // Địa chỉ được chọn
  const [minPrice, setMinPrice] = useState(null); // Giá trị nhỏ nhất
  const [maxPrice, setMaxPrice] = useState(null); // Giá trị lớn nhất
  const [selectedRange, setSelectedRange] = useState([0, 0]); // Giá trị thanh kéo
  const [isMapVisible, setIsMapVisible] = useState(false); // Trạng thái hiển thị bản đồ

  useEffect(() => {
    // Gọi API để lấy danh sách places và min/max price 
    axios.get("/post/places").then((response) => {
      const { places, minPrice, maxPrice } = response.data;

      setPlaces(places);
      setFilteredPlaces(places); // Ban đầu hiển thị tất cả places
      // setFilteredPlaces([...places, ...places]); // Ban đầu hiển thị tất cả places
      setMinPrice(minPrice); // Giá trị nhỏ nhất
      setMaxPrice(maxPrice); // Giá trị lớn nhất
      setSelectedRange([minPrice, maxPrice]); // Thiết lập khoảng giá ban đầu
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Nếu màn hình nhỏ hơn lg, đặt isMapVisible thành false
      if (window.innerWidth < 1024) {
        setIsMapVisible(false);
      }
    };
  
    // Gọi ngay khi component mount để đảm bảo trạng thái ban đầu
    handleResize();
  
    // Lắng nghe sự kiện resize
    window.addEventListener("resize", handleResize);
  
    // Dọn dẹp event listener khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  
  const filterPlaces = (range, addressInput) => {
    const [minPrice, maxPrice] = range;
  
    // Nếu input rỗng, hiển thị tất cả bài đăng trong khoảng giá
    if (!addressInput.trim()) {
      return places.filter((place) => place.price >= minPrice && place.price <= maxPrice);
    }
  
    // Loại bỏ dấu và chuyển input thành mảng từ (tokens)
    const inputTokens = removeDiacritics(addressInput.toLowerCase())
      .split(/\s+/)
      .filter((token) => token !== ""); // Loại bỏ token rỗng
  
    return places
      .map((place) => {
        // Loại bỏ dấu trong address và title
        const normalizedAddress = removeDiacritics(place.address.toLowerCase());
        const normalizedTitle = removeDiacritics(place.title.toLowerCase());
  
        // Kiểm tra nếu tất cả các từ trong input đều xuất hiện trong address hoặc title
        const allTokensMatch = inputTokens.every(
          (token) =>
            normalizedAddress.includes(token) || normalizedTitle.includes(token)
        );
  
        // Kiểm tra giá
        const withinPriceRange = place.price >= minPrice && place.price <= maxPrice;
  
        return {
          ...place,
          score: allTokensMatch && withinPriceRange ? 1 : 0, // Chỉ cho điểm nếu tất cả từ khớp và giá hợp lệ
        };
      })
      .filter((place) => place.score > 0) // Loại bỏ bài đăng không khớp
      .sort((a, b) => b.score - a.score); // Sắp xếp bài đăng theo điểm số (ở đây tất cả đều bằng 1)
  };
    
  
  const handleRangeChange = (newRange) => {
    setSelectedRange(newRange); // Cập nhật khoảng giá
    const filtered = filterPlaces(newRange, selectedAddress); // Lọc dựa trên khoảng giá và địa chỉ
    setFilteredPlaces(filtered); // Cập nhật danh sách
  };
  
  // Khi thay đổi ô search địa chỉ
  const handleAddressSearch = (input) => {
    setSelectedAddress(input); // Cập nhật giá trị ô input
    const filtered = filterPlaces(selectedRange, input); // Lọc dựa trên khoảng giá và địa chỉ
    setFilteredPlaces(filtered); // Cập nhật danh sách đã lọc
  };
  
  // Xử lý trường hợp dữ liệu chưa tải xong
  if (minPrice === null || maxPrice === null) {
    return <div>Đang tải dữ liệu...</div>;
  } else if(minPrice === 0 && maxPrice === 0) {
    return (
      <div>
        <div>
          <p>Chào mừng bạn tới website của chúng tôi.</p>
          <p>Bạn là người đầu tiên, vì vậy hãy tạo nhà để sử dụng website.</p>
          <button
            onClick={() => {
              // Điều hướng đến trang thêm nhà
              window.location.href = "/account/places/new";
            }}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Thêm nhà mới
          </button>
        </div>
      </div>
    )
  }
  

  return (
    <div className="flex flex-col relative">
      {/* Phần tìm kiếm */}
      <div className="sticky p-4 bg-gray-100 w-full rounded-2xl shadow-md z-10" style={{top: '80px'}}>
        <p className="text-2xl font-bold mb-1">Tìm kiếm nhà</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {/* Dropdown chọn địa chỉ */}
          <input
            type="text"
            placeholder="Tìm kiếm theo địa chỉ hoặc theo tiêu đề"
            value={selectedAddress}
            onChange={(e) => handleAddressSearch(e.target.value)}
            className="p-2 border rounded w-full"
          />
          {/* Thanh chọn giá */}
          {minPrice<maxPrice ? (
            <PriceRangeSelector
              minPrice={minPrice}
              maxPrice={maxPrice}
              onChange={handleRangeChange}
            />
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-gray-300 rounded-xl">
              <p className="text-xl text-gray-500 font-bold">Các nhà này đang cùng 1 giá!</p>
            </div>
          )}
          {/* Nút hiển thị/ẩn bản đồ */}
          <button
            onClick={() => setIsMapVisible((prev) => !prev)}
            className="primary lg:block hidden"
          >
            {isMapVisible ? "Ẩn bản đồ" : "Hiển thị bản đồ"}
          </button>
        </div>
      </div>

      {/* Phần danh sách nhà và bản đồ */}
      <div className="grid lg:grid-cols-4 gap-4 p-4">
        {/* Danh sách nhà */}
        <div
          className={`grid gap-4 ${
            isMapVisible ? "col-span-2" : "col-span-4"
          } grid-cols-2 ${
            isMapVisible ? "md:grid-cols-2" : "md:grid-cols-3"
          } lg:grid-cols-${isMapVisible ? "2" : "4"}`}
        >
          {filteredPlaces.length > 0 &&
            filteredPlaces.map((place) => (
              <Link to={`/place/${place.id}`} key={place.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-101 w-full h-full">
                <div className="relative object-cover">
                  <PlaceImg place={place} className="" />
                </div>

                <div className="p-4 overflow-hidden">
                  <h2 className="font-semibold text-xl text-gray-800 mt-1 truncate hover:truncate-none transition-all duration-300">{place.title}</h2>
                  
                  <h3 className="text-sm text-gray-500 mt-1 truncate hover:truncate-none transition-all duration-300">
                    {place.address}
                  </h3>

                  <div className="mt-2 flex items-center justify-end gap-2">
                    <span className="font-bold text-lg text-blue-600">{place.price}</span>
                    <span className="text-lg text-gray-600">triệu/tháng</span>
                  </div>
                </div>
              </Link>


            ))}
        </div>

        {/* Bản đồ */}
        {isMapVisible && (
          <div className="mx-2 pl-4 sticky col-span-2 lg:block hidden bg-white top-[205.2px]" style={{height: 'calc(100vh - 255.2px)'}}>
            <MapIndexPage places={filteredPlaces} />
          </div>
        )}
      </div>
    </div>
  );
}

export default IndexPage;
