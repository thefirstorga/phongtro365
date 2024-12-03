import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export function RequireAuth({ children }) {
    const { user, ready } = useContext(UserContext);

    if (!ready) {
        return <div>Loading...</div>; // Hiển thị loading khi đang kiểm tra user
    }

    if (!user) {
        return <Navigate to="/login" replace />; // Chuyển hướng về trang login nếu chưa đăng nhập
    }

    return children;
}