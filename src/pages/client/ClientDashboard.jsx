import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaImages, FaFolder, FaEnvelope } from 'react-icons/fa';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import { fetchGalleryData } from '../../services/galleryService';
import '../../styles/ClientPortal.css';

const ClientDashboard = () => {
    const { user, clientProfile, loading: authLoading, signOut, getAssignedGalleries } = useClientAuth();
    const navigate = useNavigate();
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
        }
    }, [getAssignedGalleries]);

    useEffect(() => {
        if (user) {
            loadGalleries();
        }
    }, [user, loadGalleries]);

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
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
                            <FaEnvelope />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#333' }}>{user?.email}</div>
                            <div style={{ color: '#666', fontSize: '0.85rem' }}>Account</div>
                        </div>
                    </div>
                </div>

                {galleries.length === 0 ? (
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
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
