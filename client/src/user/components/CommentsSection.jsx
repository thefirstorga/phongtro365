import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Link } from 'react-router-dom';

function CommentsSection({ placeId, userId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [canComment, setCanComment] = useState(false); // Kiểm tra nếu người dùng được phép bình luận

    // Fetch existing comments and check user eligibility to comment
    useEffect(() => {
        async function fetchData() {
            try {
                // Lấy danh sách comment hiện có
                const { data: commentsData } = await axios.get(`/post/comments/${placeId}`);
                setComments(commentsData);

                // Kiểm tra điều kiện bình luận
                if (userId) {
                    const { data: eligibilityData } = await axios.get(`/post/comments/eligibility/${placeId}/${userId}`);
                    setCanComment(eligibilityData.canComment);
                }
            } catch (error) {
                console.error('Error fetching comments or checking eligibility:', error);
            }
        }

        fetchData();
    }, [placeId, userId]);

    // Handle submitting a new comment
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return; // Không gửi bình luận rỗng

        try {
            const { data: newCommentData } = await axios.post('/post/comments', {
                userId,
                placeId,
                content: newComment,
            });
            window.location.reload()
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-4">Bình luận</h2>

            {/* Comments list */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="p-4 border-b">
                            <div className="flex items-center group">
                                {/* Avatar */}
                                <Link to={`/profile/${comment.user.id}`}>
                                    <img
                                        src={comment.user?.avatar ? BASE_URL + comment.user.avatar : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'}
                                        alt={comment.user?.name || 'Người dùng'}
                                        className="w-14 h-14 rounded-full mr-4 shadow-md"
                                    />
                                </Link>
                                {/* Tên người dùng và thời gian */}
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <Link
                                            to={`/profile/${comment.user.id}`} // Đường dẫn đến trang cá nhân
                                            className="text-gray-800 font-bold text-lg hover:underline"
                                        >
                                            {comment.user?.name || 'Ẩn danh'}
                                        </Link>
                                        {/* Thời gian */}
                                        <p className="text-gray-500 text-sm ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {new Date(comment.createdAt).toLocaleString('vi-VN', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric'
                                            })}
                                            {/* {new Date(comment.createdAt).toLocaleString()} */}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 mt-1">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Chưa có bình luận nào.</p>
                )}
            </div>

            {/* New comment form */}
            {canComment ? (
                <form className="mt-6" onSubmit={handleCommentSubmit}>
                    <textarea
                        className="w-full h-16 p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Viết bình luận của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Gửi
                    </button>
                </form>
            ) : (
                <div className="mt-4">
                    {comments.some(comment => comment.userId === userId) ? (
                        <p className="text-gray-600">
                            Bạn chỉ có thể bình luận một lần cho mỗi lượt thuê.
                        </p>
                    ) : (
                        <p className="text-gray-600">
                            Bạn chưa thuê nhà này nên không thể viết bình luận.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentsSection;
