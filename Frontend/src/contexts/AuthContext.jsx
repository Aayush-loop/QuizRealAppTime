import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/API';
export const AuthContext = createContext();

const verifyAuth = async () => {
    try {
        const response = await API.get('/auth/checkAuth', {
            withCredentials: true,
        });

        const data = await response.data
        return {
            success: data.success,
            user: data.data.user,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Authentication failed',
        };
    }
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { success, user } = await verifyAuth();
            setIsAuthenticated(success);
            setUser(user || null);
            setLoading(false);
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
