import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Hiển thị lỗi chung
    const [passwordValid, setPasswordValid] = useState(false); // Trạng thái mật khẩu

    const handlePasswordChange = (ev) => {
        const newPassword = ev.target.value;
        setPassword(newPassword);

        // Kiểm tra điều kiện mật khẩu
        if (newPassword.length >= 6) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }
    };

    async function registerUser(ev) {
        ev.preventDefault();
        setErrorMessage(''); // Reset thông báo lỗi

        if (!passwordValid) {
            setErrorMessage('Mật khẩu không đáp ứng yêu cầu.');
            return;
        }

        try {
            await axios.post('/auth/register', {
                name,
                email,
                password,
            });
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
        } catch (error) {
            if (error.response?.status === 400) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-lg mx-auto" onSubmit={registerUser}>
                    <input
                        type="text"
                        placeholder="Tran Tam"
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="yourpassword"
                        value={password}
                        onChange={handlePasswordChange} // Sử dụng hàm kiểm tra mật khẩu
                    />

                    {/* Hiển thị trạng thái mật khẩu */}
                    <div className="mt-2 text-sm">
                        {password.length > 0 && (
                            <span
                                className={`font-semibold ${
                                    passwordValid ? 'text-green-500' : 'text-red-500'
                                }`}
                            >
                                {passwordValid
                                    ? 'Mật khẩu đáp ứng yêu cầu!'
                                    : 'Mật khẩu cần ít nhất 6 ký tự.'}
                            </span>
                        )}
                    </div>

                    <button className="primary mt-4" disabled={!passwordValid}>
                        Register
                    </button>

                    {/* Hiển thị thông báo lỗi */}
                    {errorMessage && (
                        <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
                    )}

                    <div className="text-center text-gray-500 py-2">
                        Already a member?{' '}
                        <Link className="underline text-black" to={'/login'}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
