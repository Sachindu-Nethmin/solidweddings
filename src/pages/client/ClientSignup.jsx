import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaUser, FaArrowRight, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import '../../styles/ClientPortal.css';

const ClientSignup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { user } = useClientAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/client/dashboard');
        }
    }, [user, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/client/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    full_name: fullName
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create account');
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="client-login-container">
                <div className="client-login-card fade-in">
                    <div style={{ padding: '2rem 0' }}>
                        <div style={{
                            background: '#e8f5e9',
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#2e7d32',
                            fontSize: 28
                        }}>
                            <FaCheckCircle />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>Account Created!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Your account has been created successfully. Please sign in to access your galleries.
                        </p>
                        <Link to="/client/login" className="btn btn-primary login-btn" style={{ textDecoration: 'none' }}>
                            Go to Sign In <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                            src="/assets/logo-ink.png"
                            alt="Solid Weddings Logo"
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
                    <h2>Client Portal</h2>
                    <p>Create an account to view your galleries</p>
                </div>

                <form onSubmit={handleSignup}>
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
                        <label htmlFor="full_name">Full Name</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="full_name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                            <FaUser className="input-icon" />
                        </div>
                    </div>

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
                                placeholder="Create a password (min. 6 characters)"
                                required
                                minLength={6}
                            />
                            <FaLock className="input-icon" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                        {!loading && <FaArrowRight />}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/client/login" style={{ color: 'var(--gold-text)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </p>

                <Link to="/" className="back-link">
                    ← Back to Website
                </Link>
            </div>
        </div>
    );
};

export default ClientSignup;
