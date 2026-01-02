import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash, FaGripVertical } from 'react-icons/fa';
import { fetchGalleryData, getCategoryConfig, saveCategoryConfig } from '../../services/galleryService';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Editing state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    // Config state
    const [config, setConfig] = useState(getCategoryConfig());

    // --- Drag and Drop Logic ---
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // Make the drag ghost transparent? No need, default is fine.
    };

    const handleDragOver = (e, index) => {
        e.preventDefault(); // Necessary to allow dropping

        // If we are over a different item than the one we are dragging, swap them visualy
        if (draggedIndex === null || draggedIndex === index) return;

        // Perform the swap in the local `categories` state
        const newCategories = [...categories];
        const draggedItem = newCategories[draggedIndex];

        // Remove from old index
        newCategories.splice(draggedIndex, 1);
        // Insert at new index
        newCategories.splice(index, 0, draggedItem);

        setCategories(newCategories);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        // Commit the change to config
        const newOrder = categories.map(c => c.id);
        const newConfig = { ...config };
        newConfig.order = newOrder;
        saveAndReload(newConfig);
    };
    // ---------------------------

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchGalleryData();
        setCategories(data.display);
        setConfig(getCategoryConfig());
        setLoading(false);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;

        const newConfig = { ...config };
        if (newConfig.custom.find(c => c.name === newCategoryName)) return;

        newConfig.custom.push({ name: newCategoryName });
        if (!newConfig.order.includes(newCategoryName)) {
            newConfig.order = [newCategoryName, ...newConfig.order];
        }

        saveAndReload(newConfig);
        setNewCategoryName('');
        setShowAddModal(false);
    };

    const handleRename = (id) => {
        const newConfig = { ...config };
        newConfig.renames[id] = editName;
        saveAndReload(newConfig);
        setEditingId(null);
    };

    const handleHideToggle = (id) => {
        const newConfig = { ...config };
        if (newConfig.hidden.includes(id)) {
            newConfig.hidden = newConfig.hidden.filter(h => h !== id);
        } else {
            newConfig.hidden.push(id);
        }
        saveAndReload(newConfig);
    };

    const handleDeleteVirtual = (id) => {
        if (!window.confirm(`Delete category "${id}"? This only removes virtual categories.`)) return;
        const newConfig = { ...config };
        newConfig.custom = newConfig.custom.filter(c => c.name !== id);
        newConfig.order = newConfig.order.filter(o => o !== id);
        saveAndReload(newConfig);
    };

    const saveAndReload = (newConfig) => {
        saveCategoryConfig(newConfig);
        // We re-load data, but that's okay, because dragEnd has already finished the animation
        loadData();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Gallery Categories</h3>
                    <button className="btn btn-success" onClick={() => setShowAddModal(true)} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                        <FaPlus /> Add New Only
                    </button>
                </div>

                {/* Add Modal */}
                {showAddModal && (
                    <div style={{
                        padding: '1.5rem', background: '#f8f9fa', borderBottom: '1px solid #eee', animation: 'fadeIn 0.3s'
                    }}>
                        <h4 style={{ marginTop: 0 }}>Create New Category</h4>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Category Name"
                                style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
                            />
                            <button onClick={handleAddCategory} className="btn btn-primary" style={{ padding: '8px 20px' }}>Save</button>
                            <button onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ padding: '8px 20px', color: '#666', borderColor: '#666' }}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="categories-list">
                    {categories.map((cat, index) => (
                        <div
                            key={cat.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            style={{
                                padding: '1.25rem 1.5rem',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: config.hidden.includes(cat.id) ? '#fafafa' : (draggedIndex === index ? '#f3f4f6' : 'white'),
                                opacity: config.hidden.includes(cat.id) || draggedIndex === index ? 0.6 : 1,
                                cursor: 'move',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                {/* Drag Handle */}
                                <div style={{ color: '#ccc', display: 'flex', alignItems: 'center' }}>
                                    <FaGripVertical />
                                </div>

                                {/* Icon */}
                                {cat.data.type === 'folder' ? (
                                    <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
                                        {cat.data.allImages.length > 0 ? (
                                            <img src={cat.data.allImages[0].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.7rem', color: '#9ca3af' }}>Empty</div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ width: '48px', height: '48px', background: '#e0f2fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                        <FaPlus />
                                    </div>
                                )}

                                {/* Content */}
                                {editingId === cat.id ? (
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            autoFocus
                                        />
                                        <button onClick={() => handleRename(cat.id)} className="btn-icon" style={{ color: 'green', background: 'none', border: 'none', cursor: 'pointer' }}><FaCheck /></button>
                                        <button onClick={() => setEditingId(null)} className="btn-icon" style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}><FaTimes /></button>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {cat.displayName}
                                            {cat.data.type === 'virtual' && <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '99px', fontWeight: 500 }}>VIRTUAL</span>}
                                        </h4>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                                            {cat.data.allImages.length} Photos • {Object.keys(cat.data.albums).length} Albums
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => handleHideToggle(cat.id)} title={config.hidden.includes(cat.id) ? "Show" : "Hide"} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#6b7280' }}>
                                    {config.hidden.includes(cat.id) ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <button onClick={() => { setEditingId(cat.id); setEditName(cat.displayName); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#3b82f6' }}>
                                    <FaEdit />
                                </button>
                                {cat.data.type === 'virtual' && (
                                    <button onClick={() => handleDeleteVirtual(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#ef4444' }}>
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
