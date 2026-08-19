import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import { fetchGalleryData } from '../../services/galleryService';
import '../../styles/ClientPortal.css';

const GalleryDetail = () => {
    const { categoryId, albumId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useClientAuth();
    const [gallery, setGallery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/client/login');
        }
    }, [user, authLoading, navigate]);

    const loadGallery = React.useCallback(async () => {
        try {
            const data = await fetchGalleryData();
            const decodedCategoryId = decodeURIComponent(categoryId);
            const decodedAlbumId = decodeURIComponent(albumId);

            for (const cat of data.display) {
                if (cat.id === decodedCategoryId || cat.displayName === decodedCategoryId) {
                    const albumImages = cat.data.albums[decodedAlbumId];
                    if (albumImages) {
                        setGallery({
                            name: decodedAlbumId,
                            category: cat.displayName,
                            images: albumImages
                        });
                        break;
                    }
                }
            }
        } catch (err) {
            console.error('Failed to load gallery:', err);
        } finally {
            setLoading(false);
        }
    }, [categoryId, albumId]);

    useEffect(() => {
        if (user) {
            loadGallery();
        }
    }, [user, loadGallery]);

    const navigateLightbox = React.useCallback((dir) => {
        if (!gallery) return;
        setLightboxIndex(prev => {
            const next = prev + dir;
            if (next < 0) return gallery.images.length - 1;
            if (next >= gallery.images.length) return 0;
            return next;
        });
    }, [gallery]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxIndex === -1) return;
            if (e.key === 'Escape') setLightboxIndex(-1);
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, navigateLightbox]);

    const handleDownload = async (imageUrl, filename) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'photo.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            window.open(imageUrl, '_blank');
        }
    };

    const handleDownloadAll = () => {
        if (!gallery) return;
        gallery.images.forEach((img, idx) => {
            setTimeout(() => {
                handleDownload(img.src, `${gallery.name}_${idx + 1}.jpg`);
            }, idx * 500);
        });
    };

    if (authLoading || loading) {
        return (
            <div className="gallery-detail">
                <div className="empty-state">
                    <p>Loading gallery...</p>
                </div>
            </div>
        );
    }

    if (!gallery) {
        return (
            <div className="gallery-detail">
                <div className="gallery-detail-header">
                    <button onClick={() => navigate('/client/dashboard')} className="back-btn">
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                </div>
                <div className="empty-state">
                    <h2>Gallery Not Found</h2>
                    <p>This gallery doesn't exist or you don't have access.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="gallery-detail">
            <header className="gallery-detail-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/client/dashboard')} className="back-btn">
                        <FaArrowLeft /> Back
                    </button>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{gallery.name}</h1>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                            {gallery.category} · {gallery.images.length} photos
                        </p>
                    </div>
                </div>
                <button onClick={handleDownloadAll} className="download-all-btn">
                    <FaDownload /> Download All
                </button>
            </header>

            <div className="gallery-detail-content">
                <div className="photo-grid">
                    {gallery.images.map((img, idx) => (
                        <div
                            key={img.id}
                            className="photo-item"
                            onClick={() => setLightboxIndex(idx)}
                        >
                            <img src={img.src} alt={img.alt} loading="lazy" />
                            <div className="photo-overlay">
                                <FaDownload style={{ color: 'white', fontSize: '1.5rem' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {lightboxIndex !== -1 && (
                <div className="photo-lightbox" onClick={() => setLightboxIndex(-1)}>
                    <button className="lightbox-close" onClick={() => setLightboxIndex(-1)}>
                        <FaTimes />
                    </button>
                    <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}>
                        <FaChevronLeft />
                    </button>
                    <div onClick={(e) => e.stopPropagation()}>
                        <img src={gallery.images[lightboxIndex].src} alt={gallery.images[lightboxIndex].alt} />
                        <div className="lightbox-counter" style={{ textAlign: 'center', marginTop: '1rem' }}>
                            {lightboxIndex + 1} / {gallery.images.length}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                            <button
                                className="download-btn"
                                onClick={() => handleDownload(gallery.images[lightboxIndex].src, `${gallery.name}_${lightboxIndex + 1}.jpg`)}
                            >
                                <FaDownload /> Download Photo
                            </button>
                        </div>
                    </div>
                    <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}>
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GalleryDetail;
