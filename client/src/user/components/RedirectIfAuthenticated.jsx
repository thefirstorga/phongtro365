import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export function RedirectIfAuthenticated({ children }) {
    const { user, ready } = useContext(UserContext);

    if (!ready) {
        return <div>Loading...</div>; // Hiển thị loading khi đang kiểm tra user
    }

    if (user) {
        return <Navigate to="/" replace />; // Chuyển hướng về trang chủ nếu đã đăng nhập
    }

    return children;
}
