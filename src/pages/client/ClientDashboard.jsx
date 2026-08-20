import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignOutAlt, FaImages, FaFolder, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import { fetchGalleryData } from '../../services/galleryService';
import { supabase } from '../../lib/supabase';
import '../../styles/ClientPortal.css';

const STATUS_MAP = {
    pending: { icon: FaClock, color: '#d97706', bg: '#fef3c7', label: 'Pending' },
    confirmed: { icon: FaCheckCircle, color: '#16a34a', bg: '#dcfce7', label: 'Confirmed' },
    cancelled: { icon: FaTimesCircle, color: '#dc2626', bg: '#fee2e2', label: 'Cancelled' },
};

const ClientDashboard = () => {
    const { user, clientProfile, loading: authLoading, signOut, getAssignedGalleries } = useClientAuth();
    const navigate = useNavigate();
    const [galleries, setGalleries] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('galleries');

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/client/login');
        }
    }, [user, authLoading, navigate]);

    const loadGalleries = React.useCallback(async () => {
        try {
            const assignedIds = await getAssignedGalleries();
            console.log('[Dashboard] Assigned gallery IDs:', assignedIds);

            const galleryData = await fetchGalleryData();
            console.log('[Dashboard] All albums:', Object.keys(galleryData.raw).flatMap(catId =>
                Object.keys(galleryData.raw[catId].albums || {}).map(a => `fs-${catId}-${a}`)
            ));

            const matchedGalleries = [];
            for (const cat of galleryData.display) {
                for (const [albumName, images] of Object.entries(cat.data.albums)) {
                    const albumId = `fs-${cat.id}-${albumName}`;
                    if (assignedIds.includes(albumId) || assignedIds.includes(`${cat.id}/${albumName}`)) {
                        matchedGalleries.push({
                            id: albumId,
                            name: albumName,
                            category: cat.displayName,
                            categoryId: cat.id,
                            cover: images[0]?.src || '/images/logos/logo.png',
                            photoCount: images.length,
                            images: images
                        });
                    }
                }
            }

            console.log('[Dashboard] Matched galleries:', matchedGalleries.length);
            setGalleries(matchedGalleries);
        } catch (err) {
            console.error('Failed to load galleries:', err);
        }
    }, [getAssignedGalleries]);

    const loadBookings = React.useCallback(async () => {
        if (!user?.email) return;
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('client_email', user.email)
                .order('wedding_date', { ascending: false });
            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            console.error('Failed to load bookings:', err);
        }
    }, [user?.email]);

    useEffect(() => {
        if (user) {
            setLoading(true);
            Promise.all([loadGalleries(), loadBookings()]).finally(() => setLoading(false));
        }
    }, [user, loadGalleries, loadBookings]);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await signOut();
            navigate('/client/login');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="client-dashboard">
                <div className="empty-state">
                    <p>Loading your galleries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="client-dashboard">
            <header className="client-dashboard-header">
                <h1>My Galleries</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                        Welcome, {clientProfile?.full_name || user?.email}
                    </span>
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            <div className="client-dashboard-content">
                <div className="client-stats">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)' }}>
                            <FaImages />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>{galleries.length}</div>
                            <div style={{ color: '#666', fontSize: '0.85rem' }}>Galleries</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                            <FaFolder />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>
                                {galleries.reduce((acc, g) => acc + g.photoCount, 0)}
                            </div>
                            <div style={{ color: '#666', fontSize: '0.85rem' }}>Total Photos</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                            <FaCalendarAlt />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>{bookings.length}</div>
                            <div style={{ color: '#666', fontSize: '0.85rem' }}>Bookings</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
                            <FaEnvelope />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#333' }}>{user?.email}</div>
                            <div style={{ color: '#666', fontSize: '0.85rem' }}>Account</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="client-tabs">
                    <button className={`client-tab ${activeTab === 'galleries' ? 'active' : ''}`} onClick={() => setActiveTab('galleries')}>
                        <FaImages /> My Galleries
                    </button>
                    <button className={`client-tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                        <FaCalendarAlt /> My Bookings
                    </button>
                </div>

                {activeTab === 'galleries' && (
                    galleries.length === 0 ? (
                        <div className="empty-state">
                            <FaImages style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }} />
                            <h2>No Galleries Assigned</h2>
                            <p>Your photographer hasn't assigned any galleries to your account yet.</p>
                        </div>
                    ) : (
                        <div className="gallery-grid">
                            {galleries.map(gallery => (
                                <div
                                    key={gallery.id}
                                    className="gallery-card"
                                    onClick={() => navigate(`/client/gallery/${encodeURIComponent(gallery.categoryId)}/${encodeURIComponent(gallery.name)}`)}
                                >
                                    <img src={gallery.cover} alt={gallery.name} className="gallery-card-cover" />
                                    <div className="gallery-card-info">
                                        <h3>{gallery.name}</h3>
                                        <p>{gallery.category} · {gallery.photoCount} photos</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'bookings' && (
                    bookings.length === 0 ? (
                        <div className="empty-state">
                            <FaCalendarAlt style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }} />
                            <h2>No Bookings Yet</h2>
                            <p>You haven't made any booking requests yet.</p>
                            <Link to="/booking" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Book a Session</Link>
                        </div>
                    ) : (
                        <div className="bookings-list">
                            {bookings.map(booking => {
                                const s = STATUS_MAP[booking.status] || STATUS_MAP.pending;
                                const StatusIcon = s.icon;
                                const date = new Date(booking.wedding_date + 'T00:00:00');
                                return (
                                    <div key={booking.id} className="booking-card">
                                        <div className="booking-card-header">
                                            <div className="booking-card-date">
                                                <div className="booking-date-day">{date.getDate()}</div>
                                                <div className="booking-date-month">{date.toLocaleString('en-US', { month: 'short' })}</div>
                                                <div className="booking-date-year">{date.getFullYear()}</div>
                                            </div>
                                            <div className="booking-card-info">
                                                <h3>{booking.package_name} Package</h3>
                                                <div className="booking-card-meta">
                                                    {booking.venue && (
                                                        <span><FaMapMarkerAlt /> {booking.venue}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="booking-card-status" style={{ background: s.bg, color: s.color }}>
                                                <StatusIcon /> {s.label}
                                            </div>
                                        </div>
                                        {booking.message && (
                                            <div className="booking-card-message">{booking.message}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
