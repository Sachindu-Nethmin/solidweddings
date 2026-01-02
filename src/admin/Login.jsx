import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

// Pre-computed SHA-256 hashes for security
// Username: "admin"
const USER_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
// Password: "@admin456123"
const PASS_HASH = "26d0c00d9bd59054613b83d3bb736437b881c69cad4e4f52636ecd5166f424f3";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isAdminAuthenticated') === 'true') {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    // Helper to compute SHA-256 hash of a string
    const computeHash = async (str) => {
        const msgBuffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const inputUserHash = await computeHash(username);
            const inputPassHash = await computeHash(password);

            // Simulate network delay for realism/timing attack mitigation
            setTimeout(() => {
                if (inputUserHash === USER_HASH && inputPassHash === PASS_HASH) {
                    localStorage.setItem('isAdminAuthenticated', 'true');
                    navigate('/admin/dashboard');
                } else {
                    setError('Invalid username or password');
                    setLoading(false);
                }
            }, 800);
        } catch (err) {
            console.error("Hashing error", err);
            setError('An error occurred. Please try again.');
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
                            src="/images/logos/logo.png"
                            alt="Solid Weddings Logo"
                            className="admin-logo"
                            style={{
                                display: 'block',
                                height: '50px',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                            onError={(e) => {
                                console.error("Logo load failed", e);
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
                            background: '#ffeceb',
                            color: '#ff6b6b',
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
