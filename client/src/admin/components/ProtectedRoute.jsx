import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from './AdminContext';

function ProtectedRoute({ children }) {
  const { admin, ready } = useContext(AdminContext);

  if (!ready) {
    // Có thể hiển thị một spinner hoặc trạng thái "loading" trong khi chờ dữ liệu
    return <div>Loading...</div>;
  }

  if (!admin) {
    // Nếu chưa đăng nhập, chuyển hướng tới trang login
    return <Navigate to="/admin/login" />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung của route
  return children;
}

export default ProtectedRoute;
