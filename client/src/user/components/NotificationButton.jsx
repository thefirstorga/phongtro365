import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);  // Lưu các thông báo
  const [unreadCount, setUnreadCount] = useState(0);  // Lưu số lượng thông báo chưa đọc
  const [isOpen, setIsOpen] = useState(false);  // Đóng/mở popup
  const [loading, setLoading] = useState(false);  // Trạng thái loading
  const [page, setPage] = useState(1);  // Dùng để phân trang
  const [hasMore, setHasMore] = useState(true);  // Kiểm tra xem còn thông báo để load nữa không

  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  // Lấy thông báo khi component mount hoặc page thay đổi
  useEffect(() => {
    const fetchNotifications = async () => {
      if (loading || !hasMore) return;  // Nếu đang tải hoặc không còn thông báo nữa thì không gọi API

      setLoading(true);
      try {
        const response = await axios.get(`/post/notifications?page=${page}`);
        
        // Nếu không có thông báo mới, không cần thêm nữa
        if (response.data.notifications.length === 0) {
          setHasMore(false);
        }
        
        // Kiểm tra nếu thông báo đã tồn tại trong mảng, chỉ thêm mới nếu chưa có
        setNotifications((prevNotifications) => {
          const newNotifications = response.data.notifications.filter(
            (notif) => !prevNotifications.some((existingNotif) => existingNotif.id === notif.id)
          );
          
          return [...prevNotifications, ...newNotifications];
        });
        
        setUnreadCount(response.data.unreadCount);
        
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);  // Chỉ gọi khi page thay đổi

  // Đánh dấu thông báo đã đọc khi click vào thông báo
  const handleNotificationClick = async (notificationId, placeId) => {
    try {
      await axios.post("/post/mark-as-read", { notificationId });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);  // Giảm số thông báo chưa đọc
      // Chuyển đến trang Place
      window.open(`/place/${placeId}`, '_blank');
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Đóng popup khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current && !popupRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Lắng nghe sự kiện click ra ngoài
    document.addEventListener("click", handleClickOutside);

    // Dọn dẹp event listener khi component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Hàm scroll để load thêm thông báo khi người dùng lướt đến cuối
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);  // Tăng page lên để load thêm thông báo
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="p-2 bg-gray-400 text-white rounded-full border-2 m-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
          </svg>
          {unreadCount > 0 && (
            <p className="absolute -top-4 -right-4 rounded-full bg-red-600 text-white text-xs px-2 py-1">
              {unreadCount}
            </p>
          )}
        </span>
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute mt-2 right-0 w-[360px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-auto scrollbar"
          onScroll={handleScroll}
        >
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-600">Bạn chưa có thông báo.</div>
          ) : (
            <div>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex p-4 border-b border-gray-200 cursor-pointer ${
                    !notif.read ? "bg-gray-100 font-semibold" : "text-gray-500"
                  } hover:bg-gray-300 transition-all duration-200`}  // Thêm hiệu ứng hover thay đổi nền
                  onClick={() => handleNotificationClick(notif.id, notif.place.id)}
                >
                  <img
                    src={BASE_URL + notif.place.photos[0]?.url}
                    alt="Place"
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-md line-clamp-2">{notif.message}</p>
                    <span className="text-xs font-normal">{notif.type}</span>
                  </div>
                </div>
              ))}
              {loading && <div className="p-4 text-center">Đang tải thêm...</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationButton;