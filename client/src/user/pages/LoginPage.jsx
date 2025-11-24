import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const [isBlacklisted, setIsBlacklisted] = useState(false); // Trạng thái BLACKLISTED
  const [blacklistedMessage, setBlacklistedMessage] = useState(""); // Thông báo cho BLACKLISTED
  const [errors, setErrors] = useState({ email: "", password: "" }); // State lỗi cho email và password

  async function handleLoginSubmit(ev) {
    ev.preventDefault();

    // Kiểm tra nếu có trường không hợp lệ
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email không được để trống!";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Mật khẩu không được để trống!";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return; // Dừng việc gửi yêu cầu nếu có lỗi
    }

    // Nếu tất cả trường hợp lệ, tiếp tục gửi yêu cầu đăng nhập
    try {
      const { data } = await axios.post("/auth/login", { email, password });

      if (data.user.status === "BLACKLISTED") {
        setIsBlacklisted(true); // Hiển thị popup thông báo
        setBlacklistedMessage("Tài khoản của bạn đã bị khóa vĩnh viễn.");
      } else {
        setUser(data.user);
        alert("Đăng nhập thành công");
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 403 && data.status === "BLACKLISTED") {
          setIsBlacklisted(true); // Hiển thị popup nếu BLACKLISTED
          setBlacklistedMessage(data.error);
        } else {
          alert(data.error || "Đăng nhập thất bại. Vui lòng thử lại.");
        }
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  }

  async function handleLogout() {
    window.location.reload();
  }

  // Hàm để reset lỗi khi người dùng nhập lại
  const handleEmailChange = (ev) => {
    setEmail(ev.target.value);
    if (ev.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  const handlePasswordChange = (ev) => {
    setPassword(ev.target.value);
    if (ev.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  const handleLoginWithGoogle = () => {
    window.location.href = "http://localhost:4000/auth/google";
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}


            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}


          <button type="submit" className="primary">Login</button>

          <button
            onClick={handleLoginWithGoogle}
            className="mt-1 border flex items-center justify-center p-2 w-full text-white font-semibold rounded-lg py-2 px-6 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          >
            <svg viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000" className="size-5 me-3"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
            Login with Google
          </button>

          <div className="text-center py-2 mt-2 text-gray-500">
            <Link className="underline text-black" to={"/forgot-password"}>
              Quên mật khẩu?
            </Link>
          </div>
          <div className="text-center py-1 text-gray-500">
            Bạn chưa có tài khoản?{" "}
            <Link className="underline text-black" to={"/register"}>
              Đăng ký
            </Link>
          </div>
        </form>
      </div>

      {/* Popup hiển thị nếu tài khoản bị khóa */}
      {isBlacklisted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Thông báo</h2>
            <p className="mb-4">{blacklistedMessage}</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}