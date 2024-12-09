import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Hiển thị lỗi chung
    const [passwordValid, setPasswordValid] = useState(false); // Trạng thái mật khẩu
    const [errors, setErrors] = useState({ name: '', email: '', password: '' }); // Lỗi cho từng trường

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

    const handleInputChange = (field, value) => {
        if (field === 'name') setName(value);
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);

        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' })); // Reset lỗi khi người dùng nhập lại
    };

    async function registerUser(ev) {
        ev.preventDefault();
        setErrorMessage(''); // Reset thông báo lỗi
        setErrors({ name: '', email: '', password: '' }); // Reset lỗi cho từng trường

        let isValid = true;
        const newErrors = { name: '', email: '', password: '' };

        // Kiểm tra các trường bắt buộc
        if (!name) {
            newErrors.name = 'Tên không được để trống!';
            isValid = false;
        }
        if (!email) {
            newErrors.email = 'Email không được để trống!';
            isValid = false;
        }
        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống!';
            isValid = false;
        }

        if (!passwordValid) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
            isValid = false;
        }

        if (!isValid) {
            setErrors(newErrors);
            return; // Dừng việc gửi yêu cầu nếu có lỗi
        }

        try {
            await axios.post('/auth/register', {
                name,
                email,
                password,
            });
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            setRedirect(true);
        } catch (error) {
            if (error.response?.status === 400) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        }
    }

    if (redirect) return <Navigate to={'/login'} />;

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-lg mx-auto" onSubmit={registerUser}>
                    <input
                        type="text"
                        placeholder="Tran Tam"
                        value={name}
                        onChange={(ev) => handleInputChange('name', ev.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => handleInputChange('email', ev.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

                    <input
                        type="password"
                        placeholder="yourpassword"
                        value={password}
                        onChange={handlePasswordChange} // Sử dụng hàm kiểm tra mật khẩu
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}

                    {/* Hiển thị trạng thái mật khẩu */}
                    <div className="mt-2 text-sm">
                        {password.length > 0 && (
                            <span
                                className={`font-semibold ${passwordValid ? 'text-green-500' : 'text-red-500'}`}
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