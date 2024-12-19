import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRouteLogin({ children }) {
    const [loading, setLoading] = useState(true);
    const [hasAdmin, setHasAdmin] = useState(false);

    useEffect(() => {
        async function checkAdmin() {
            try {
                const { data } = await axios.get('/admin-api/check-admin');
                setHasAdmin(data.hasAdmin);
            } catch (error) {
                console.error('Error checking admin:', error);
            } finally {
                setLoading(false);
            }
        }
        checkAdmin();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!hasAdmin) {
        return <Navigate to="/admin" />;
    }

    return children;
}