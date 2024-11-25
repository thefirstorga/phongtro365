import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PriceRangeSelector from "../components/PriceRangeSelector";
import MapIndexPage from "../components/MapIndexPage";

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
    const inputTokens = removeDiacritics(addressInput.toLowerCase())
      .split(/\s+/)
      .filter((token) => token !== ""); // Loại bỏ token rỗng
  
    return places.filter((place) => {
      // Kiểm tra giá
      const withinPriceRange = place.price >= minPrice && place.price <= maxPrice;
  
      // Kiểm tra địa chỉ
      if (inputTokens.length === 0) return withinPriceRange;
  
      const addressTokens = removeDiacritics(place.address.toLowerCase()).split(/\s+/);
      const matchedTokens = inputTokens.filter((token) =>
        addressTokens.some((addressToken) => addressToken.startsWith(token))
      );
  
      return withinPriceRange && matchedTokens.length > 0;
    });
  };
  
  // Khi kéo thanh giá
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
  }
  

  return (
    <div className="flex flex-col relative">
      {/* Phần tìm kiếm */}
      <div className="sticky p-4 bg-gray-100 w-full rounded-2xl shadow-md" style={{top: '80px'}}>
        <p className="text-2xl font-bold mb-1">Tìm kiếm nhà</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {/* Dropdown chọn địa chỉ */}
          <input
            type="text"
            placeholder="Tìm kiếm địa chỉ"
            value={selectedAddress}
            onChange={(e) => handleAddressSearch(e.target.value)}
            className="p-2 border rounded w-full"
          />
          {/* Thanh chọn giá */}
          <PriceRangeSelector
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={handleRangeChange}
          />
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
              <Link to={"/place/" + place.id} key={place.id}>
                <div className="bg-gray-500 mb-2 rounded-2xl flex">
                  {place.photos[0]?.url && (
                    <img
                      className="rounded-2xl object-cover aspect-square"
                      src={
                        "http://localhost:4000/post/uploads/" + place.photos[0]?.url
                      }
                      alt=""
                    />
                  )}
                </div>
                <h2 className="font-bold">{place.address}</h2>
                <h3 className="text-sm leading-4">{place.title}</h3>
                <div className="mt-1">
                  <span className="font-bold">${place.price}</span> per night
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
