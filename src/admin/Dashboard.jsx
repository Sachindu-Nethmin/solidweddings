import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash } from 'react-icons/fa';
import { fetchGalleryData, getCategoryConfig, saveCategoryConfig } from '../services/galleryService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('categories');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Editing state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    // Config state
    const [config, setConfig] = useState(getCategoryConfig());

    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated');
        if (isAuth !== 'true') {
            navigate('/admin/login');
        } else {
            loadData();
        }
    }, [navigate]);

    const loadData = async () => {
        setLoading(true);
        // Fetch fresh data including FS and Config
        const data = await fetchGalleryData();
        setCategories(data.display);
        setConfig(getCategoryConfig());
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin/login');
    };

    // --- ACTIONS ---

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;

        const newConfig = { ...config };
        // Check if exists
        if (newConfig.custom.find(c => c.name === newCategoryName)) return;

        newConfig.custom.push({ name: newCategoryName });
        // Add to order at the beginning
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

    const moveCategory = (index, direction) => {
        const newOrder = categories.map(c => c.id);
        // Ensure we have a full order list based on current display

        if (direction === 'up' && index > 0) {
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        }

        const newConfig = { ...config };
        newConfig.order = newOrder;
        saveAndReload(newConfig);
    };

    const saveAndReload = (newConfig) => {
        saveCategoryConfig(newConfig);
        loadData();
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>

            {/* Tabs */}
            <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <button
                    className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Manage Categories
                </button>
                {/* Placeholder for future tabs */}
                <button className="btn btn-outline" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Manage Photos (Coming Soon)</button>
            </div>

            {/* MAIN CONTENT */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="dashboard-content">
                    {activeTab === 'categories' && (
                        <div className="categories-manager">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3>Gallery Categories</h3>
                                <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                                    <FaPlus /> Add New Category
                                </button>
                            </div>

                            {/* Add Modal */}
                            {showAddModal && (
                                <div style={{
                                    background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem',
                                    border: '1px solid #ddd', animation: 'fadeIn 0.3s'
                                }}>
                                    <h4>Create New Category</h4>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Category Name"
                                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
                                        />
                                        <button onClick={handleAddCategory} className="btn btn-primary">Save</button>
                                        <button onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ color: '#666', borderColor: '#666' }}>Cancel</button>
                                    </div>
                                </div>
                            )}

                            {/* Categories List */}
                            <div className="categories-list" style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                                {categories.map((cat, index) => (
                                    <div key={cat.id} style={{
                                        padding: '1.5rem',
                                        borderBottom: '1px solid #eee',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: config.hidden.includes(cat.id) ? '#f9f9f9' : 'white',
                                        opacity: config.hidden.includes(cat.id) ? 0.6 : 1
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            {/* Reorder Controls */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                <button
                                                    onClick={() => moveCategory(index, 'up')}
                                                    disabled={index === 0}
                                                    style={{ border: 'none', background: 'none', cursor: index === 0 ? 'default' : 'pointer', color: '#999' }}
                                                >
                                                    <FaArrowUp />
                                                </button>
                                                <button
                                                    onClick={() => moveCategory(index, 'down')}
                                                    disabled={index === categories.length - 1}
                                                    style={{ border: 'none', background: 'none', cursor: index === categories.length - 1 ? 'default' : 'pointer', color: '#999' }}
                                                >
                                                    <FaArrowDown />
                                                </button>
                                            </div>

                                            {/* Icon/Image */}
                                            {cat.data.type === 'folder' ? (
                                                <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
                                                    {cat.data.allImages.length > 0 ? (
                                                        <img src={cat.data.allImages[0].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.8rem', color: '#999' }}>Empty</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ width: '50px', height: '50px', background: '#e3f2fd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2196f3' }}>
                                                    <FaPlus />
                                                </div>
                                            )}

                                            {/* Name */}
                                            {editingId === cat.id ? (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                    />
                                                    <button onClick={() => handleRename(cat.id)} className="btn-icon" style={{ color: 'green' }}><FaCheck /></button>
                                                    <button onClick={() => setEditingId(null)} className="btn-icon" style={{ color: 'red' }}><FaTimes /></button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {cat.displayName}
                                                        {cat.id !== cat.displayName && <span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 'normal' }}>(Original: {cat.id})</span>}
                                                        {cat.data.type === 'virtual' && <span style={{ fontSize: '0.7rem', background: '#e3f2fd', color: '#2196f3', padding: '2px 6px', borderRadius: '4px' }}>New</span>}
                                                    </h4>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{cat.data.allImages.length} Photos • {Object.keys(cat.data.albums).length} Albums</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {/* Hide/Show */}
                                            <button
                                                onClick={() => handleHideToggle(cat.id)}
                                                title={config.hidden.includes(cat.id) ? "Show Category" : "Hide Category"}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}
                                            >
                                                {config.hidden.includes(cat.id) ? <FaEyeSlash /> : <FaEye />}
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() => { setEditingId(cat.id); setEditName(cat.displayName); }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#3498db' }}
                                            >
                                                <FaEdit />
                                            </button>

                                            {/* Delete (Virtual Only) */}
                                            {cat.data.type === 'virtual' && (
                                                <button
                                                    onClick={() => handleDeleteVirtual(cat.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#e74c3c' }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
