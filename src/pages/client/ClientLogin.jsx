import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import '../../styles/ClientPortal.css';

const ClientLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn, user } = useClientAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/client/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signIn(email, password);
            navigate('/client/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-login-container">
            <div className="client-login-card fade-in">
                <div className="client-login-header">
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
                            src="/assets/logo-gold.png"
                            alt="Solid Weddings Logo"
                            style={{
                                display: 'block',
                                height: '50px',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span style="color:#b89d5c; font-family:serif; font-size: 1.2rem; white-space:nowrap;">SOLID WEDDINGS</span>';
                            }}
                        />
                    </div>
                    <h2>Client Portal</h2>
                    <p>Sign in to view your galleries</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div style={{
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
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            <FaEnvelope className="input-icon" />
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

                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/client/signup" style={{ color: 'var(--gold-text)', fontWeight: 600, textDecoration: 'none' }}>
                        Create one
                    </Link>
                </p>

                <Link to="/" className="back-link">
                    ← Back to Website
                </Link>
            </div>
        </div>
    );
};

export default ClientLogin;
