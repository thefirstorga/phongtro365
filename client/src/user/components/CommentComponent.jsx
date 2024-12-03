import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { BASE_URL } from '../../config';
import { Link } from 'react-router-dom';

function CommentComponent({ placeId, userBookings }) {
    const { user } = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [canComment, setCanComment] = useState(false);

    // Fetch existing comments for the place
    useEffect(() => {
        axios.get(`/post/comments/${placeId}`)
            .then(response => {
                setComments(response.data.comments);
            })
            .catch(error => console.error('Error fetching comments:', error));
    }, [placeId]);

    // Kiểm tra xem người dùng có thể bình luận hay không
    useEffect(() => {
        const rentedBookings = userBookings?.filter(booking => booking.placeId === placeId && booking.status === 'RENTED');
        const hasCommented = comments.some(comment => comment.userId === user.id);
        setCanComment(rentedBookings.length > 0 && !hasCommented);
    }, [userBookings, comments, placeId, user.id]);

    // Handle new comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            alert('Vui lòng nhập nội dung bình luận.');
            return;
        }

        try {
            const rentedBooking = userBookings.find(booking => booking.placeId === placeId && booking.status === 'RENTED');
            const response = await axios.post('/post/comments', {
                placeId,
                userId: user.id,
                bookingId: rentedBooking.id, // Gửi bookingId của lượt thuê
                content: newComment
            });
            setComments([response.data.comment, ...comments]); // Add new comment at the top
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.');
        }
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4">Bình luận</h2>

            {/* Comments list */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="p-4 border-b">
                            <div className="flex items-center group">
                                {/* Avatar */}
                                <Link to={`/profile/${comment.userId}`}>
                                    <img
                                        src={comment.avatar ? BASE_URL + comment.avatar : 'https://banner2.cleanpng.com/20180411/ike/avfjoey57.webp'}
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
                    <p className="text-gray-600">Chưa có bình luận nào.</p>
                )}
            </div>

            {/* New comment form */}
            {canComment ? (
                <form className="mt-6" onSubmit={handleCommentSubmit}>
                    <textarea
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Viết bình luận của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Gửi
                    </button>
                </form>
            ) : (
                <div>
                    {comments.find(comment => comment.userId === user.id)
                        ? <p className="text-gray-600 mt-4">
                            Bạn chỉ có thể bình luận một lần cho mỗi lượt thuê.
                        </p>
                        : <p className="text-gray-600 mt-4">
                            Bạn chưa thuê nhà này nên không thể viết bình luận.
                        </p>
                    }
                </div>
            )}
        </div>
    );
}

export default CommentComponent;
