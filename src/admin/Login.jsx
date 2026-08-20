import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import '../styles/AdminLogin.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signIn, isAdmin } = useAdminAuth();

    useEffect(() => {
        if (isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [isAdmin, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signIn(username, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card fade-in">
                <div className="admin-login-header">
                    <div style={{
                        background: '#333',
                        padding: '15px',
                        borderRadius: '10px',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                    <img
                            src="/assets/logo-ink.png"
                            alt="Solid Weddings Logo"
                            className="admin-logo"
                            style={{
                                display: 'block',
                                height: '50px',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span style="color:white; font-family:serif; font-size: 1.2rem; white-space:nowrap;">SOLID WEDDINGS</span>';
                            }}
                        />
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Sign in to your admin dashboard</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="error-message" style={{
                    background: '#fdf6ee',
                        color: '#b89d5c',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem'
                        }}>
                            <FaExclamationCircle />
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                            <FaUser className="input-icon" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <FaLock className="input-icon" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <FaArrowRight />}
                    </button>
                </form>

                <Link to="/" className="back-link">
                    ← Back to Website
                </Link>
            </div>
        </div>
    );
};

export default Login;
