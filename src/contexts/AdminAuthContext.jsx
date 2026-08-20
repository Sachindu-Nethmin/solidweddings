/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => useContext(AdminAuthContext);

const STORAGE_KEY = 'adminAuthSession';

// Credentials are verified server-side by /api/admin/login, which returns a
// signed, expiring session token. Nothing secret ever ships in the client bundle.
const readStoredSession = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.token || !parsed?.expiresAt || parsed.expiresAt <= Date.now()) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return parsed;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

export const AdminAuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSession(readStoredSession());
        setLoading(false);
    }, []);

    const signIn = useCallback(async (username, password) => {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || 'Invalid username or password');
        }

        const newSession = { token: data.token, expiresAt: data.expiresAt };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        setSession(newSession);
        return true;
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
    }, []);

    // Authenticated fetch wrapper for every admin-only API route
    // (/api/admin/*, /api/sign-upload, /api/delete-image). Attaches the
    // session token and clears it if the server reports it's no longer valid.
    const adminFetch = useCallback(async (url, options = {}) => {
        const current = readStoredSession();
        if (!current) {
            setSession(null);
            throw new Error('Your admin session has expired. Please sign in again.');
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${current.token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem(STORAGE_KEY);
            setSession(null);
        }

        return response;
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
        <AdminAuthContext.Provider value={{ isAdmin: !!session, signIn, signOut, adminFetch }}>
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
