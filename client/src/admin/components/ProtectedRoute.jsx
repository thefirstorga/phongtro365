import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from './AdminContext';
import axios from 'axios';

function ProtectedRoute({ children }) {
  const { admin, ready } = useContext(AdminContext);
  const [hasAdmin, setHasAdmin] = useState(false);
  useEffect(() => {
    // Gọi API để kiểm tra xem có admin hay chưa
    axios.get('/admin-api/check-admin')
      .then(response => {
        setHasAdmin(response.data.hasAdmin)
      })
      .catch(error => {
        console.error('Error checking for admin:', error);
        // Xử lý lỗi, có thể chuyển tới trang lỗi hoặc giữ lại trang hiện tại
      });
  }, []);

  if (!ready && hasAdmin) {
    // Có thể hiển thị một spinner hoặc trạng thái "loading" trong khi chờ dữ liệu
    return <div>Loading...</div>;
  }

  if (!admin && hasAdmin) {
    // Nếu chưa đăng nhập, chuyển hướng tới trang login
    return <Navigate to="/admin/login" />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung của route
  return children;
}

export default ProtectedRoute;