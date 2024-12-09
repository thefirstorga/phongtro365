// import axios from "axios";
// import { createContext, useEffect, useState } from "react";

// export const UserContext = createContext({

// })

// export function UserContextProvider({children}) {
//     const [user, setUser] = useState(null)
//     const [ready, setReady] = useState(false)

//     useEffect(() => {
//         if(!user) {
//             const {data} = axios.get('/auth/profile').then(({data}) => {
//                 setUser(data)
//                 setReady(true)
//             })
//         }
//     }, [user])
    
//     return(
//         <UserContext.Provider value={{user, setUser, ready}}>
//             {children}
//         </UserContext.Provider>
//     )
// }

import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!user) {
            axios.get('/auth/profile')
                .then(({ data }) => {
                    setUser(data);
                    setReady(true);

                    // Kiểm tra nếu violationCount >= 4 và thực hiện logout
                    if (data.violationCount >= 4) {
                        // Gọi API logout nếu có
                        axios.post('/auth/logout')
                            .then(() => {
                                setUser(null); // Xóa thông tin user khỏi state
                                // Thực hiện bất kỳ hành động cần thiết khác khi logout
                            })
                            .catch(err => {
                                console.error("Logout failed", err);
                            });
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch profile", err);
                });
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}