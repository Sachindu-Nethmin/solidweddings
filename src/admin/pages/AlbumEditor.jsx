import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaUpload, FaImages, FaTimes, FaFolder, FaCloud } from 'react-icons/fa';
import { fetchGalleryData, getAlbumConfig, saveAlbumConfig, getAlbumSettings, saveAlbumSettings } from '../../services/galleryService';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Component ---
const SortablePhoto = ({ id, photo, idx, removePhoto }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        aspectRatio: '1/1',
        borderRadius: '6px',
        overflow: 'hidden',
        cursor: 'grab',
        touchAction: 'none' // Prevent scrolling while dragging
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img src={photo.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />

            {/* Delete Overlay - Prevent Drag on Button */}
            <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                style={{
                    position: 'absolute', top: '5px', right: '5px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'rgba(255,0,0,0.9)', color: 'white', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
            >
                <FaTimes size={12} />
            </button>

            {/* Badges */}
            {(photo.isNew || String(photo.id).startsWith('temp-') || String(photo.id).startsWith('added-') || String(photo.id).startsWith('pending-')) && (
                <span style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#3b82f6', color: 'white', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '3px' }}>NEW</span>
            )}
        </div>
    );
};

const AlbumEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    // Data State
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [originalFsPhotos, setOriginalFsPhotos] = useState([]);

    // UI State
    const [saving, setSaving] = useState(false);

    // Form State
    const [albumName, setAlbumName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [albumPhotos, setAlbumPhotos] = useState([]); // {src, id, isNew, isFsInfo, file}
    const [editingSource, setEditingSource] = useState('virtual');

    // --- Drag and Drop Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setAlbumPhotos((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Fetch all data to resolve ID and Category Lists
            const galleryData = await fetchGalleryData();
            setCategories(galleryData.display);

            if (isEditing) {
                await loadAlbumForEditing(id, galleryData);
            } else {
                setEditingSource('virtual'); // Default for new
            }
        } catch (err) {
            console.error("Failed to load editor data", err);
            alert("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    const loadAlbumForEditing = async (albumId, galleryData) => {
        // We need to find the album object.
        // It could be in Virtual Config OR in Filesystem Data.

        // 1. Check Virtual
        const virtualAlbums = getAlbumConfig().map(a => ({ ...a, source: 'virtual' }));
        const virtualMatch = virtualAlbums.find(a => a.id === albumId);

        if (virtualMatch) {
            setEditingSource('virtual');
            setAlbumName(virtualMatch.name);
            setSelectedCategory(virtualMatch.categoryId);
            setCoverPhoto(virtualMatch.cover);

            const photos = (virtualMatch.photos || []).map((p, idx) => ({
                src: typeof p === 'string' ? p : p.src,
                isNew: false,
                id: `virtual-${idx}-${Date.now()}` // Ensure ID for DnD
            }));
            setAlbumPhotos(photos);
            return;
        }

        // 2. Check Filesystem
        let foundFs = null;

        // Loop categories
        for (const cat of galleryData.display) {
            const catNode = cat.data;
            if (catNode && catNode.albums) {
                for (const name of Object.keys(catNode.albums)) {
                    const photos = catNode.albums[name];

                    // Logic to reconstruct ID match
                    const firstPhoto = photos[0];
                    let deducedC = cat.id;
                    let deducedN = name;

                    if (firstPhoto) {
                        const fsPhoto = photos.find(p => !p.id.startsWith('added-') && !String(p.id).startsWith('virtual-'));
                        if (fsPhoto) {
                            const parts = decodeURIComponent(fsPhoto.src).split('/');
                            const pIdx = parts.indexOf('photos');
                            if (pIdx !== -1) {
                                deducedC = parts[pIdx + 1];
                                deducedN = parts[pIdx + 2];
                            }
                        }
                    }

                    const testId = `fs-${deducedC}-${deducedN}`;

                    if (testId === albumId) {
                        foundFs = {
                            id: testId,
                            name: name,
                            categoryId: cat.id,
                            photos: photos,
                            source: 'filesystem',
                            cover: photos.length > 0 ? photos[0].src : null
                        };
                        break;
                    }
                }
            }
            if (foundFs) break;
        }

        if (foundFs) {
            setEditingSource('filesystem');
            setAlbumName(foundFs.name);
            setSelectedCategory(foundFs.categoryId);
            setCoverPhoto(foundFs.cover);

            setOriginalFsPhotos(foundFs.photos || []);

            const photos = (foundFs.photos || []).map(p => ({
                src: p.src,
                id: p.id || `fs-photo-${Math.random()}`, // Ensure ID
                isNew: p.id && String(p.id).startsWith('added-'),
                isFsInfo: true
            }));
            setAlbumPhotos(photos);
        } else {
            console.warn("Album not found or creation mode");
        }
    };

    // --- File Handling ---
    const handleFileRead = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2000000) return alert("File too large (>2MB)");
            const base64 = await handleFileRead(file);
            setCoverPhoto(base64);
        }
    };

    // --- Upload Strategies ---

    // 1. Local Filesystem Upload (Dev Only)
    const uploadLocal = async (file, category, album) => {
        const formData = new FormData();
        formData.append('category', category);
        formData.append('albumName', album);
        formData.append('photo', file);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            const res = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error("Local upload failed");
            return await res.json();
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    };

    // 2. Cloudinary Upload (Production/Vercel)
    const uploadCloudinary = async (file, category, album) => {
        // Get Signature
        const sigRes = await fetch('/api/sign-upload');
        if (!sigRes.ok) throw new Error("Backend signer unreachable (Are you on Vercel?)");
        const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

        // Upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', `solidweddings/${category}/${albumName}`);

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!cloudinaryRes.ok) throw new Error("Cloudinary upload failed");
        const data = await cloudinaryRes.json();

        return { success: true, filePath: data.secure_url };
    };

    const handlePhotosChange = async (e) => {
        const files = Array.from(e.target.files);

        if (!selectedCategory || !albumName) {
            alert("Please ensure Category and Album Name are set before adding photos.");
            return;
        }

        const newPhotos = [];

        for (const file of files) {
            // Check size limits early
            if (file.size > 5000000) { // 5MB limit
                alert(`File ${file.name} is too large (>5MB). Skipping.`);
                continue;
            }

            try {
                // Generate preview
                const base64 = await handleFileRead(file);
                // Create a temporary ID that is almost certain to be unique but recognizable as temporary
                const tempId = `temp-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                newPhotos.push({
                    src: base64, // Preview
                    file: file, // Store file for upload on Save
                    isNew: true,
                    id: tempId
                });

            } catch (err) {
                console.error("Error reading file:", err);
            }
        }
        setAlbumPhotos(prev => [...prev, ...newPhotos]);
    };

    const removePhoto = (index) => {
        setAlbumPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!albumName) return alert("Album name required");
        if ((editingSource === 'virtual' || editingSource === 'filesystem') && !selectedCategory)
            return alert("Category required");

        setSaving(true);

        const processedPhotos = [...albumPhotos];
        const uploads = processedPhotos.map((p, idx) => ({ p, idx })).filter(item => item.p.file);

        try {
            // 1. Process Pending Uploads
            if (uploads.length > 0) {
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

                for (const item of uploads) {
                    let result = { success: false };

                    // Priority 1: Cloudinary (If keys exist, it's best)
                    // Priority 2: Localhost Filesystem (If on dev)
                    // Priority 3: Base64 Fallback (Demo)

                    // For this project, let's prefer Localhost on Dev to keep existing flow, 
                    // and Cloudinary on Vercel.

                    if (isLocalhost) {
                        try {
                            result = await uploadLocal(item.p.file, selectedCategory, albumName);
                        } catch (e) {
                            console.warn("Local upload failed, trying Cloudinary...", e);
                        }
                    }

                    if (!result.success) {
                        try {
                            result = await uploadCloudinary(item.p.file, selectedCategory, albumName);
                        } catch (e) {
                            console.warn("Cloudinary upload failed (Check Keys), falling back to Demo Mode.", e);
                        }
                    }

                    // Fallback to Demo Mode (Base64)
                    if (!result.success) {
                        console.log("Using LocalStorage (Base64) for image persistence (Demo Mode)");
                        result = { success: true, filePath: item.p.src };
                    }

                    if (result.success) {
                        processedPhotos[item.idx] = {
                            ...item.p,
                            isNew: false,
                            src: result.filePath,
                            file: undefined,
                            id: result.filePath
                        };
                    } else {
                        throw new Error("All upload methods failed");
                    }
                }
            }

            // 2. Save Config
            if (editingSource === 'virtual') {
                const rawPhotos = processedPhotos.map(p => p.src);
                const albumData = {
                    id: isEditing ? id : Date.now().toString(),
                    name: albumName,
                    categoryId: selectedCategory,
                    cover: coverPhoto,
                    photos: rawPhotos
                };

                const currentConfig = getAlbumConfig();
                const updatedAlbums = isEditing
                    ? currentConfig.map(a => a.id === id ? albumData : a)
                    : [...currentConfig, albumData];

                saveAlbumConfig(updatedAlbums);

            } else if (editingSource === 'filesystem') {
                const settings = getAlbumSettings();
                const settingsCopy = {
                    ...settings,
                    renames: { ...settings.renames },
                    categoryOverrides: { ...settings.categoryOverrides },
                    hiddenPhotos: [...(settings.hiddenPhotos || [])],
                    addedPhotos: { ...settings.addedPhotos },
                    photoOrder: { ...settings.photoOrder } // New Order Map
                };

                if (!settingsCopy.renames) settingsCopy.renames = {};
                if (!settingsCopy.categoryOverrides) settingsCopy.categoryOverrides = {};
                if (!settingsCopy.photoOrder) settingsCopy.photoOrder = {};

                settingsCopy.renames[id] = albumName;
                settingsCopy.categoryOverrides[id] = selectedCategory;

                const currentIds = new Set(processedPhotos.map(p => p.id).filter(pid => pid));

                // Detect Hidden
                originalFsPhotos.forEach(p => {
                    if (p.id && !currentIds.has(p.id)) {
                        if (!p.id.startsWith('added-')) {
                            if (!settingsCopy.hiddenPhotos.includes(p.id)) {
                                settingsCopy.hiddenPhotos.push(p.id);
                            }
                        }
                    }
                });

                // Detect Added Virtual (now includes Server paths)
                const virtualsToSave = processedPhotos
                    .filter(p => !p.isFsInfo)
                    .map(p => p.src);

                settingsCopy.addedPhotos[id] = virtualsToSave;

                // SAVE ORDER: Map current processedPhotos IDs
                // CRITICAL: We must ensure we grab the CURRENT IDs from processedPhotos, which now contains the server paths for new uploads.
                // We double check to filter out any remaining temp- IDs just in case, though they should be gone.
                const currentOrder = processedPhotos
                    .map(p => p.id)
                    .filter(pid => pid && !String(pid).startsWith('temp-') && !String(pid).startsWith('pending-'));

                settingsCopy.photoOrder[id] = currentOrder;

                saveAlbumSettings(settingsCopy);
            }

            navigate('/admin/albums');

        } catch (err) {
            console.error("Save failed", err);
            alert(`Error saving album: ${err.message}. Check server status.`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Editor...</div>;

    return (
        <div className="fade-in">
            {saving && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>
                    <div className="spinner"></div>
                    <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>Uploading & Saving...</div>
                </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => navigate('/admin/albums')} className="btn btn-outline" style={{ color: '#666', borderColor: 'transparent', paddingLeft: 0 }}>
                    <FaArrowLeft /> Back to Albums
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">
                        {isEditing
                            ? (editingSource === 'filesystem' ? 'Edit Filesystem Album' : 'Edit Virtual Album')
                            : 'Create New Album'
                        }
                    </h3>
                </div>

                <div style={{ padding: '1.5rem', maxWidth: '800px' }}>

                    {/* Source Indicator */}
                    {isEditing && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            {editingSource === 'filesystem' ? (
                                <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', padding: '5px 10px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <FaFolder /> FILESYSTEM ALBUM
                                </span>
                            ) : (
                                <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', padding: '5px 10px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <FaCloud /> VIRTUAL ALBUM
                                </span>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* 1. Basic Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Album Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={albumName}
                                    onChange={e => setAlbumName(e.target.value)}
                                    placeholder="e.g. Wedding 2024"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div>
                                <label className="form-label">Category</label>
                                <select
                                    className="form-control"
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    // ENABLED for FS now
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', background: 'white' }}
                                >
                                    <option value="">Select Category...</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.displayName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 2. Cover Photo (Virtual Only) */}
                        {editingSource === 'virtual' && (
                            <div>
                                <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Cover Photo</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '100px', height: '100px', background: '#eee', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {coverPhoto ? (
                                            <img src={coverPhoto} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ color: '#999', fontSize: '0.8rem' }}>No Cover</span>
                                        )}
                                    </div>
                                    <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                                        <FaUpload /> Upload Cover
                                        <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* 3. Photos */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label className="form-label" style={{ fontWeight: 'bold' }}>Photos ({albumPhotos.length})</label>
                                <label className="btn btn-outline" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <FaImages /> Add Photos
                                    <input type="file" accept="image/*" multiple onChange={handlePhotosChange} style={{ display: 'none' }} />
                                </label>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px', fontStyle: 'italic' }}>
                                Note: New photos are temporarily shown here. They will be uploaded and saved to the 'public/images/photos/{selectedCategory}' folder when you click "Save Album".
                            </div>

                            {albumPhotos.length === 0 ? (
                                <div style={{ padding: '2rem', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
                                    No photos in this album.
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={albumPhotos.map(p => p.id)}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div style={{
                                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px',
                                            border: '1px solid #eee', padding: '1rem', borderRadius: '8px'
                                        }}>
                                            {albumPhotos.map((p, idx) => (
                                                <SortablePhoto
                                                    key={p.id}
                                                    id={p.id}
                                                    photo={p}
                                                    idx={idx}
                                                    removePhoto={removePhoto}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button onClick={handleSave} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '1rem' }}>
                                <FaSave /> {saving ? 'Saving...' : 'Save Album'}
                            </button>
                            <button onClick={() => navigate('/admin/albums')} className="btn btn-outline" style={{ padding: '10px 24px' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumEditor;
