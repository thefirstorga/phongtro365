import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function IndexPage() {
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    // Gọi API để kiểm tra xem có admin hay chưa
    axios.get('/admin-api/check-admin')
      .then(response => {
        if (response.data.hasAdmin) {
          // Nếu đã có admin, chuyển tới trang login
          setRedirect('/admin/login');
        } else {
          // Nếu chưa có admin, chuyển tới trang register
          setRedirect('/admin/register');
        }
      })
      .catch(error => {
        console.error('Error checking for admin:', error);
        // Xử lý lỗi, có thể chuyển tới trang lỗi hoặc giữ lại trang hiện tại
      });
  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <h1>Đang kiểm tra trạng thái admin...</h1>
    </div>
  );
}

export default IndexPage;