import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaClock, FaTrash, FaEye } from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const STATUS_COLORS = {
    pending: { bg: '#fef3c7', color: '#d97706', icon: FaClock, label: 'Pending' },
    confirmed: { bg: '#dcfce7', color: '#16a34a', icon: FaCheckCircle, label: 'Confirmed' },
    cancelled: { bg: '#fee2e2', color: '#dc2626', icon: FaTimesCircle, label: 'Cancelled' },
};

const BookingsManager = () => {
    const { adminFetch } = useAdminAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await adminFetch('/api/bookings');
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (err) {
            console.error('Failed to load bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await adminFetch('/api/admin/manage-booking', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (response.ok) {
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
                if (selectedBooking?.id === id) setSelectedBooking({ ...selectedBooking, status });
            }
        } catch (err) {
            alert('Error updating booking: ' + err.message);
        }
    };

    const deleteBooking = async (id) => {
        if (!window.confirm('Delete this booking?')) return;
        try {
            const response = await adminFetch(`/api/admin/manage-booking?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                setBookings(prev => prev.filter(b => b.id !== id));
                if (selectedBooking?.id === id) setSelectedBooking(null);
            }
        } catch (err) {
            alert('Error deleting booking: ' + err.message);
        }
    };

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const counts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Bookings</h2>
                <button onClick={loadBookings} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Refresh</button>
            </div>

            {/* Stats + Filter */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    ['all', 'All', counts.all],
                    ['pending', 'Pending', counts.pending],
                    ['confirmed', 'Confirmed', counts.confirmed],
                    ['cancelled', 'Cancelled', counts.cancelled],
                ].map(([key, label, count]) => (
                    <button key={key} onClick={() => setFilter(key)} style={{
                        padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                        background: filter === key ? '#1f2937' : '#f3f4f6',
                        color: filter === key ? '#fff' : '#6b7280',
                        transition: 'all .2s'
                    }}>{label} ({count})</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedBooking ? '1fr 380px' : '1fr', gap: 24, alignItems: 'start' }}>
                {/* Table */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Loading bookings...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                            <FaCalendarAlt style={{ fontSize: '2rem', color: '#ddd', marginBottom: 12 }} />
                            <p>No bookings found</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Client</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Date</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Package</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Status</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(b => {
                                        const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                                        return (
                                            <tr key={b.id} onClick={() => setSelectedBooking(b)}
                                                style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: selectedBooking?.id === b.id ? '#f0f7ff' : 'transparent', transition: 'background .15s' }}>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ fontWeight: 600, color: '#1f2937' }}>{b.client_name}</div>
                                                    <div style={{ fontSize: 12, color: '#6b7280' }}>{b.client_email}</div>
                                                </td>
                                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{new Date(b.wedding_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                <td style={{ padding: '12px 16px' }}>{b.package_name}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
                                                        <s.icon fontSize={12} /> {s.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <button onClick={e => { e.stopPropagation(); setSelectedBooking(b); }} style={{ background: '#f3f4f6', border: 'none', padding: 6, borderRadius: 6, cursor: 'pointer', color: '#6b7280' }} title="View"><FaEye /></button>
                                                        <button onClick={e => { e.stopPropagation(); deleteBooking(b.id); }} style={{ background: '#fee2e2', border: 'none', padding: 6, borderRadius: 6, cursor: 'pointer', color: '#dc2626' }} title="Delete"><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selectedBooking && (
                    <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ margin: 0, fontSize: 18 }}>Booking Details</h3>
                            <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 18 }}>×</button>
                        </div>

                        {(() => {
                            const s = STATUS_COLORS[selectedBooking.status] || STATUS_COLORS.pending;
                            return (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: s.bg }}>
                                        <s.icon style={{ color: s.color }} />
                                        <span style={{ fontWeight: 600, color: s.color }}>{s.label}</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <FaUser style={{ color: '#9ca3af', marginTop: 3 }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 15 }}>{selectedBooking.client_name}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <FaEnvelope style={{ color: '#9ca3af', marginTop: 3 }} />
                                            <div style={{ fontSize: 14, color: '#374151' }}>{selectedBooking.client_email}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <FaPhone style={{ color: '#9ca3af', marginTop: 3 }} />
                                            <div style={{ fontSize: 14, color: '#374151' }}>{selectedBooking.client_phone}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <FaCalendarAlt style={{ color: '#9ca3af', marginTop: 3 }} />
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                                                {new Date(selectedBooking.wedding_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <FaMapMarkerAlt style={{ color: '#9ca3af', marginTop: 3 }} />
                                            <div style={{ fontSize: 14, color: '#374151' }}>{selectedBooking.venue || 'Not specified'}</div>
                                        </div>

                                        <div style={{ padding: '12px 16px', background: '#f9fafb', borderRadius: 10 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: '#6b7280', marginBottom: 4 }}>Package</div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>{selectedBooking.package_name}</div>
                                        </div>

                                        {selectedBooking.message && (
                                            <div style={{ padding: '12px 16px', background: '#f9fafb', borderRadius: 10 }}>
                                                <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: '#6b7280', marginBottom: 4 }}>Notes</div>
                                                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{selectedBooking.message}</div>
                                            </div>
                                        )}

                                        <div style={{ paddingTop: 16, borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: '#6b7280', marginBottom: 4 }}>Update Status</div>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                {selectedBooking.status !== 'confirmed' && (
                                                    <button onClick={() => updateStatus(selectedBooking.id, 'confirmed')} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', background: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                                                        <FaCheckCircle style={{ marginRight: 6 }} />Confirm
                                                    </button>
                                                )}
                                                {selectedBooking.status !== 'cancelled' && (
                                                    <button onClick={() => updateStatus(selectedBooking.id, 'cancelled')} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                                                        <FaTimesCircle style={{ marginRight: 6 }} />Cancel
                                                    </button>
                                                )}
                                                {selectedBooking.status !== 'pending' && (
                                                    <button onClick={() => updateStatus(selectedBooking.id, 'pending')} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', background: '#fef3c7', color: '#d97706', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                                                        <FaClock style={{ marginRight: 6 }} />Pending
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsManager;
