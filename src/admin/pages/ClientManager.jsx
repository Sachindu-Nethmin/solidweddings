import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaUser, FaImages, FaSave, FaTimes, FaEnvelope } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { fetchGalleryData } from '../../services/galleryService';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const ClientManager = () => {
    const { adminFetch } = useAdminAuth();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newClient, setNewClient] = useState({ email: '', password: '', full_name: '' });
    const [selectedClient, setSelectedClient] = useState(null);
    const [assignedGalleries, setAssignedGalleries] = useState([]);
    const [availableGalleries, setAvailableGalleries] = useState([]);
    const [saving, setSaving] = useState(false);
    const [emailInput, setEmailInput] = useState('');

    useEffect(() => {
        loadClients();
        loadGalleries();
    }, []);

    const loadClients = async () => {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) {
            setClients(data || []);
        }
        setLoading(false);
    };

    const loadGalleries = async () => {
        const galleryData = await fetchGalleryData();

        const galleries = [];
        for (const cat of galleryData.display) {
            for (const [albumName, images] of Object.entries(cat.data.albums)) {
                const albumId = `fs-${cat.id}-${albumName}`;
                galleries.push({
                    id: albumId,
                    name: albumName,
                    category: cat.displayName,
                    photoCount: images.length
                });
            }
        }
        setAvailableGalleries(galleries);
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await adminFetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newClient.email,
                    password: newClient.password,
                    full_name: newClient.full_name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create client');
            }

            setShowAddModal(false);
            setNewClient({ email: '', password: '', full_name: '' });
            loadClients();
        } catch (err) {
            alert('Error creating client: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return;

        try {
            const response = await adminFetch(`/api/admin/delete-user?clientId=${clientId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete client');
            }

            if (selectedClient?.id === clientId) {
                setSelectedClient(null);
                setAssignedGalleries([]);
            }
            loadClients();
        } catch (err) {
            alert('Error deleting client: ' + err.message);
        }
    };

    const handleSelectClient = async (client) => {
        setSelectedClient(client);
        setEmailInput(client.email);
        const { data } = await supabase
            .from('client_galleries')
            .select('gallery_id')
            .eq('client_email', client.email);

        setAssignedGalleries(data?.map(d => d.gallery_id) || []);
    };

    const handleAssignByEmail = async (galleryId) => {
        const email = emailInput.trim();
        if (!email) {
            alert('Please enter a client email first.');
            return;
        }

        const isAssigned = assignedGalleries.includes(galleryId);

        try {
            if (isAssigned) {
                const response = await adminFetch(
                    `/api/admin/assign-gallery?client_email=${encodeURIComponent(email)}&gallery_id=${encodeURIComponent(galleryId)}`,
                    { method: 'DELETE' }
                );

                const data = await response.json();
                if (!response.ok) throw new Error(data.error);

                setAssignedGalleries(assignedGalleries.filter(id => id !== galleryId));
            } else {
                const response = await adminFetch('/api/admin/assign-gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        client_email: email,
                        gallery_id: galleryId
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error);

                setAssignedGalleries([...assignedGalleries, galleryId]);
            }
        } catch (err) {
            alert('Error updating gallery assignment: ' + err.message);
        }
    };

    const handleAssignAll = async () => {
        const email = emailInput.trim();
        if (!email) {
            alert('Please enter a client email first.');
            return;
        }

        const unassigned = availableGalleries.filter(g => !assignedGalleries.includes(g.id));
        if (unassigned.length === 0) {
            alert('All galleries are already assigned.');
            return;
        }

        setSaving(true);
        try {
            for (const gallery of unassigned) {
                await adminFetch('/api/admin/assign-gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ client_email: email, gallery_id: gallery.id })
                });
            }
            setAssignedGalleries(availableGalleries.map(g => g.id));
        } catch (err) {
            alert('Error assigning galleries: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ padding: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--hero-title-font)', color: '#333' }}>Client Manager</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                        background: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        padding: '0.7rem 1.2rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.95rem'
                    }}
                >
                    <FaPlus /> Add Client
                </button>
            </div>

            {/* Email assignment bar */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                padding: '1.2rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <FaEnvelope style={{ color: '#999', fontSize: '1.2rem' }} />
                <div style={{ flex: 1, minWidth: 250 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: 4, fontWeight: 600 }}>
                        Assign galleries to client email
                    </label>
                    <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="client@email.com"
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: '2px solid #eee',
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
                        onBlur={(e) => e.target.style.borderColor = '#eee'}
                    />
                </div>
                <button
                    onClick={handleAssignAll}
                    disabled={saving || !emailInput.trim()}
                    style={{
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: saving || !emailInput.trim() ? 'not-allowed' : 'pointer',
                        opacity: saving || !emailInput.trim() ? 0.6 : 1,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {saving ? 'Assigning...' : 'Assign All'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Gallery list with email assignment */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #eee', fontWeight: '600', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><FaImages style={{ marginRight: '0.5rem' }} />All Galleries ({availableGalleries.length})</span>
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {availableGalleries.map(gallery => (
                            <div
                                key={gallery.id}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderBottom: '1px solid #f5f5f5',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '500', color: '#333' }}>{gallery.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{gallery.category} · {gallery.photoCount} photos</div>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                    <input
                                        type="checkbox"
                                        checked={assignedGalleries.includes(gallery.id)}
                                        onChange={() => handleAssignByEmail(gallery.id)}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        background: assignedGalleries.includes(gallery.id) ? '#ff6b6b' : '#ccc',
                                        borderRadius: '24px',
                                        transition: '0.3s'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            content: '""',
                                            height: '18px',
                                            width: '18px',
                                            left: assignedGalleries.includes(gallery.id) ? '22px' : '3px',
                                            bottom: '3px',
                                            background: 'white',
                                            borderRadius: '50%',
                                            transition: '0.3s'
                                        }} />
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Registered clients list */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #eee', fontWeight: '600', color: '#333' }}>
                        Registered Clients ({clients.length})
                    </div>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading...</div>
                    ) : clients.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                            <FaUser style={{ fontSize: '2rem', color: '#ddd', marginBottom: '0.5rem' }} />
                            <p>No clients yet</p>
                        </div>
                    ) : (
                        <div>
                            {clients.map(client => {
                                const isSelected = emailInput === client.email;
                                return (
                                    <div
                                        key={client.id}
                                        onClick={() => {
                                            setEmailInput(client.email);
                                            setSelectedClient(client);
                                            // Load assigned galleries for this email
                                            supabase
                                                .from('client_galleries')
                                                .select('gallery_id')
                                                .eq('client_email', client.email)
                                                .then(({ data }) => {
                                                    setAssignedGalleries(data?.map(d => d.gallery_id) || []);
                                                });
                                        }}
                                        style={{
                                            padding: '1rem 1.5rem',
                                            borderBottom: '1px solid #f5f5f5',
                                            cursor: 'pointer',
                                            background: isSelected ? '#f0f7ff' : 'white',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#333' }}>{client.full_name}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{client.email}</div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ff6b6b',
                                                cursor: 'pointer',
                                                padding: '0.5rem'
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '450px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Add New Client</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateClient}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={newClient.full_name}
                                    onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '2px solid #eee', borderRadius: '8px', fontSize: '1rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Email</label>
                                <input
                                    type="email"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '2px solid #eee', borderRadius: '8px', fontSize: '1rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Password</label>
                                <input
                                    type="password"
                                    value={newClient.password}
                                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                                    required
                                    minLength={6}
                                    style={{ width: '100%', padding: '10px', border: '2px solid #eee', borderRadius: '8px', fontSize: '1rem' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    width: '100%',
                                    background: '#ff6b6b',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <FaSave /> {saving ? 'Creating...' : 'Create Client'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManager;
