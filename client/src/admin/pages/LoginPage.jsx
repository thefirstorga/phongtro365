// import {Link, Navigate} from "react-router-dom";
// import {useContext, useEffect, useState} from "react";
// import axios from "axios";
// import { AdminContext } from "../components/AdminContext";

// export default function LoginPage() {
  
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [redirect, setRedirect] = useState(false);
//   const {admin, setAdmin} = useContext(AdminContext);

//   async function handleLoginSubmit(ev) {
//     ev.preventDefault();
//     try {
//       const {data} = await axios.post('/admin-api/login', {email,password});
//       if(data == 'not found') alert('Không tồn tại')
//       else {
//         setAdmin(data);
//         alert('Login successful');
//         setRedirect(true);
//       }
//     } catch (e) {
//       alert('Login failed');
//     }
//   }

//   if (redirect) {
//     return <Navigate to={'/admin/users'} />
//   }

//   if(admin) {
//     return <Navigate to={'/admin/users'} />
//   }

//   return (
//     <div className="mt-4 grow flex items-center justify-around">
//       <div className="mb-64">
//         <h1 className="text-4xl text-center mb-4">Login admin</h1>
//         <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
//           <input type="email"
//                  placeholder="your@email.com"
//                  value={email}
//                  onChange={ev => setEmail(ev.target.value)} />
//           <input type="password"
//                  placeholder="password"
//                  value={password}
//                  onChange={ev => setPassword(ev.target.value)} />
//           <button className="primary">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../components/AdminContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const { admin, setAdmin } = useContext(AdminContext);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        setError(null);

        try {
            const { data } = await axios.post('/admin-api/login', { email, password }, { withCredentials: true });
            setAdmin(data);
            alert('Đăng nhập thành công');
            setRedirect(true);
        } catch (e) {
            if (e.response && e.response.data.error) {
                setError(e.response.data.error);
            } else {
                setError('Không thể kết nối tới server');
            }
        }
    }

    if (redirect || admin) {
        return <Navigate to="/admin/users" />;
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Đăng nhập Admin</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                    />
                    <button className="primary">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}