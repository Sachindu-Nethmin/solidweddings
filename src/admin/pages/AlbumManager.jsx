import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaImage, FaFolder, FaCloud, FaEdit } from 'react-icons/fa';
import { fetchGalleryData, getAlbumConfig, saveAlbumConfig, getAlbumSettings, saveAlbumSettings } from '../../services/galleryService';

const AlbumManager = () => {
    const navigate = useNavigate();

    // Data State
    const [categories, setCategories] = useState([]);
    const [albums, setAlbums] = useState([]); // Combined list
    const [loading, setLoading] = useState(true);
    const [albumSettings, setAlbumSettings] = useState({ hidden: [], renames: {} });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const settings = getAlbumSettings();
        setAlbumSettings(settings); // Load latest settings

        const galleryData = await fetchGalleryData();
        setCategories(galleryData.display);

        const virtualAlbums = getAlbumConfig().map(a => ({ ...a, source: 'virtual' }));

        const fsAlbums = [];
        galleryData.display.forEach(cat => {
            const catNode = cat.data;
            if (catNode && catNode.albums) {
                Object.keys(catNode.albums).forEach(albumName => {
                    const isVirtual = virtualAlbums.find(va => va.name === albumName && va.categoryId === cat.id);
                    if (!isVirtual) {
                        const photos = catNode.albums[albumName];
                        const cover = photos.length > 0 ? photos[0].src : null;

                        // ID Logic match Service
                        let originalAlbumName = albumName;
                        if (photos.length > 0) {
                            const fsPhoto = photos.find(p => !p.id.startsWith('added-'));
                            if (fsPhoto) {
                                const src = fsPhoto.src;
                                const decodedParts = decodeURIComponent(src).split('/');
                                const photoIdx = decodedParts.indexOf('photos');
                                if (photoIdx !== -1 && decodedParts.length > photoIdx + 2) {
                                    originalAlbumName = decodedParts[photoIdx + 2];
                                }
                            }
                        }

                        const id = `fs-${cat.id}-${originalAlbumName}`;

                        fsAlbums.push({
                            id: id,
                            name: albumName,
                            originalName: originalAlbumName,
                            categoryId: cat.id,
                            cover: cover,
                            photos: photos,
                            source: 'filesystem'
                        });
                    }
                });
            }
        });

        setAlbums([...virtualAlbums, ...fsAlbums]);
        setLoading(false);
    };

    // --- Actions ---
    const handleCreateClick = () => {
        navigate('/admin/albums/create');
    };

    const handleEditClick = (album) => {
        // Navigate to dedicated edit page with ID
        // Note: For FS albums, ID is constructed as "fs-cat-name".
        // URL safety: The ID might contain characters not safe for URL if not careful, but usually it's fine.
        // If "fs-Wedding-My Album & Fun", we should encode.
        navigate(`/admin/albums/edit/${encodeURIComponent(album.id)}`);
    };

    const handleDeleteAlbum = (album) => {
        if (!window.confirm("Delete this album? This will hide it from the gallery.")) return;

        if (album.source === 'virtual') {
            const currentConfig = getAlbumConfig();
            const updated = currentConfig.filter(a => a.id !== album.id);
            saveAlbumConfig(updated);
        } else {
            // Hide FS album
            const settings = getAlbumSettings();
            settings.hidden.push(album.id); // Add ID to hidden list
            saveAlbumSettings(settings);
        }
        loadData();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Album Manager</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-success" onClick={handleCreateClick} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                            <FaPlus /> Create New Album
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="album-list">
                    {albums.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                            No albums found.
                        </div>
                    ) : (
                        albums.map(album => (
                            <div key={album.id} style={{
                                padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: album.source === 'filesystem' ? '#fafafa' : 'white'
                            }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '6px', background: '#eee', overflow: 'hidden' }}>
                                        {album.cover ? (
                                            <img src={album.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <FaImage style={{ margin: '20px', color: '#ccc' }} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {album.name}
                                            {album.source === 'filesystem' ?
                                                <span style={{ fontSize: '0.65rem', background: '#eee', color: '#666', padding: '2px 6px', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <FaFolder size={10} /> FILESYSTEM
                                                </span>
                                                :
                                                <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <FaCloud size={10} /> VIRTUAL
                                                </span>
                                            }
                                            {album.originalName && album.originalName !== album.name && (
                                                <span style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'normal' }}>({album.originalName})</span>
                                            )}
                                        </h4>
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>In {categories.find(c => c.id === album.categoryId)?.displayName || album.categoryId}</span>
                                        <span style={{ fontSize: '0.85rem', color: '#999', marginLeft: '10px' }}>• {album.photos.length} Photos</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleEditClick(album)} style={{ color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }} title="Edit">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteAlbum(album)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }} title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlbumManager;
