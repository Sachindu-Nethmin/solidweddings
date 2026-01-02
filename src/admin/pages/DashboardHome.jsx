import React, { useEffect, useState } from 'react';
import { FaUsers, FaImages, FaEnvelope, FaChartLine } from 'react-icons/fa';
import { fetchGalleryData } from '../../services/galleryService';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalPhotos: 0,
        totalAlbums: 0,
        categories: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchGalleryData();
            let photos = 0;
            let albums = 0;

            Object.values(data.raw).forEach(cat => {
                photos += cat.allImages.length;
                albums += Object.keys(cat.albums).length;
            });

            setStats({
                totalPhotos: photos,
                totalAlbums: albums,
                categories: Object.keys(data.raw).length
            });
        };
        loadStats();
    }, []);

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Overveiw</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                        <FaImages />
                    </div>
                    <div>
                        <div className="stat-value">{stats.totalPhotos}</div>
                        <div className="stat-label">Total Photos</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                        <FaImages />
                    </div>
                    <div>
                        <div className="stat-value">{stats.totalAlbums}</div>
                        <div className="stat-label">Active Albums</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                        <FaChartLine />
                    </div>
                    <div>
                        <div className="stat-value">{stats.categories}</div>
                        <div className="stat-label">Categories</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
                        <FaEnvelope />
                    </div>
                    <div>
                        <div className="stat-value">0</div>
                        <div className="stat-label">New Messages</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent Activity</h3>
                </div>
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280' }}>
                    No recent activities recorded.
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
