/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => useContext(AdminAuthContext);

const ADMIN_USER_HASH = import.meta.env.VITE_ADMIN_USER_HASH || '';
const ADMIN_PASS_HASH = import.meta.env.VITE_ADMIN_PASS_HASH || '';

const computeHash = async (str) => {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const AdminAuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
        setIsAdmin(authenticated);
        setLoading(false);
    }, []);

    const signIn = useCallback(async (username, password) => {
        const inputUserHash = await computeHash(username);
        const inputPassHash = await computeHash(password);

        if (inputUserHash === ADMIN_USER_HASH && inputPassHash === ADMIN_PASS_HASH) {
            localStorage.setItem('isAdminAuthenticated', 'true');
            setIsAdmin(true);
            return true;
        }

        throw new Error('Invalid username or password');
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('isAdminAuthenticated');
        setIsAdmin(false);
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#f5f5f5'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <AdminAuthContext.Provider value={{ isAdmin, signIn, signOut }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const AdminRouteGuard = ({ children }) => {
    const { isAdmin } = useAdminAuth();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!isAdmin) {
            setRedirect(true);
        }
    }, [isAdmin]);

    if (redirect) {
        window.location.hash = '#/admin/login';
        return null;
    }

    if (!isAdmin) {
        return null;
    }

    return children;
};
