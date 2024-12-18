import React, { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(ev) {
        ev.preventDefault();
        try {
            const { data } = await axios.post("/auth/forgot-password", { email });
            setMessage(data.message);
            setError("");
            setEmail("")
        } catch (error) {
            setMessage("");
            setError(error.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64 w-[448px]">
                <h1 className="text-2xl text-center mb-4">Vui lòng nhập email của bạn</h1>
                <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <button className="primary mt-4">Xác nhận</button>
                </form>
                {message && <div className="text-green-500 mt-4">{message}</div>}
                {error && <div className="text-red-500 mt-4">{error}</div>}
            </div>
        </div>
    );
}
