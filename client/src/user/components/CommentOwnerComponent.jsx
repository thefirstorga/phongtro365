import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Link } from 'react-router-dom';

function CommentOwnerComponent({ placeId }) {
    const [comments, setComments] = useState([]);

    // Fetch existing comments for the place
    useEffect(() => {
        axios.get(`/post/place/${placeId}/comments`)
            .then(response => {
                setComments(response.data.comments);
            })
            .catch(error => console.error('Error fetching comments:', error));
    }, [placeId]);

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4">Bình luận từ khách thuê</h2>

            {/* Comments list */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="p-4 border-b">
                            <div className="flex items-center group">
                                {/* Avatar */}
                                <Link to={`/profile/${comment.userId}`}>
                                    <img
                                        src={comment.avatar
                                            ? BASE_URL + comment.avatar
                                            : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'}
                                        alt={comment.userName}
                                        className="w-16 h-16 rounded-full mr-4"
                                    />
                                </Link>
                                {/* Tên người dùng và thời gian */}
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <a
                                            href={`/profile/${comment.userId}`} // Đường dẫn đến trang cá nhân
                                            className="text-gray-800 font-bold text-xl hover:underline"
                                        >
                                            {comment.userName}
                                        </a>
                                        {/* Thời gian, sẽ chỉ hiển thị khi hover vào phần bình luận */}
                                        <p className="text-gray-500 text-sm ml-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 mt-2 group">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Chưa có bình luận nào từ khách thuê.</p>
                )}
            </div>
        </div>
    );
}

export default CommentOwnerComponent;