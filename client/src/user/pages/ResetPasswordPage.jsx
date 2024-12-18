import React, { useState } from "react";
import axios from "axios";
import { Navigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState(false)

    async function handleSubmit(ev) {
        ev.preventDefault();
        try {
            const { data } = await axios.post("/auth/reset-password", { token, newPassword });
            setMessage(data.message);
            setError("");
            alert("Mật khẩu của bạn đã được đặt lại thành công")
            setRedirect(true)
        } catch (error) {
            setMessage("");
            setError(error.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    }

    if(redirect) return <Navigate to={'/login'}/>

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64 w-[448px]">
                <h1 className="text-4xl text-center mb-4">Đặt lại mật khẩu</h1>
                <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(ev) => setNewPassword(ev.target.value)}
                    />
                    <button className="primary mt-4">Xác nhận</button>
                </form>
                {message && <p className="text-green-500 mt-4">{message}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}
