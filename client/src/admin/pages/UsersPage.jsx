import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BASE_URL} from '../../config'

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [blacklistedUsers, setBlacklistedUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách người dùng
    axios.get('/auth/')
      .then(response => {
        const allUsers = response.data;

        // Phân loại người dùng vào blacklist và active
        const blacklisted = allUsers.filter(user => user.status === 'BLACKLISTED');
        const active = allUsers.filter(user => user.status === 'ACTIVE' || user.status === 'HIDDEN');

        setBlacklistedUsers(blacklisted);
        setActiveUsers(active);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Danh sách Người dùng</h1>

      {/* Active Users */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeUsers.map(user => (
            <div key={user.id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all">
              <div className="flex items-center space-x-4">
                <a 
                  href={`/profile/${user.id}`} target="_blank"
                >
                  <img
                    src={user.avatar ? BASE_URL + user.avatar : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </a>
                <div>
                  <a href={`/profile/${user.id}`} target="_blank">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                  </a>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.phone ? user.phone : 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Zalo: {user.zalo ? user.zalo : 'Chưa cập nhật'}</p>
                <p className="text-sm text-gray-600">Vi phạm: {user.violationCount}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blacklisted Users */}
      <section>
        <h2 className="text-2xl font-medium mb-4 text-red-600">Người dùng bị chặn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blacklistedUsers.map(user => (
            <div key={user.id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all border-2 border-red-500">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar ? BASE_URL + user.avatar : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-red-600">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.phone ? user.phone : 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Zalo: {user.zalo ? user.zalo : 'Chưa cập nhật'}</p>
                <p className="text-sm text-gray-600">Vi phạm: {user.violationCount}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default UsersPage;
