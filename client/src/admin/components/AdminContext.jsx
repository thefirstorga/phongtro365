import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AdminContext = createContext({});

export function AdminContextProvider({children}) {
    const [admin, setAdmin] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Kiểm tra nếu admin đã có thì không gọi API nữa
        if (admin === null) {
            const fetchAdmin = async () => {
                try {
                    const { data } = await axios.get('/admin-api/profile');
                    setAdmin(data);
                    setReady(true);
                } catch (error) {
                    console.error("Error fetching admin profile:", error);
                    setReady(true);  // Dù có lỗi hay không thì vẫn set ready để tránh trạng thái chờ đợi vô tận
                }
            };

            fetchAdmin();
        }
    }, [admin]); // Chỉ gọi API nếu admin là null

    return (
        <AdminContext.Provider value={{ admin, setAdmin, ready }}>
            {children}
        </AdminContext.Provider>
    );
}