import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome, FaImages, FaUtensils, FaEnvelope, FaSignOutAlt, FaBars, FaBell, FaUserCircle, FaFolder
} from 'react-icons/fa';
import '../styles/AdminDashboard.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isAdminAuthenticated');
            navigate('/admin/login');
        }
    };

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/admin/dashboard': return 'Dashboard Overview';
            case '/admin/categories': return 'Category Manager';
            case '/admin/photos': return 'Photo Library';
            default: return 'Admin Panel';
        }
    };

    return (
        <div className={`admin-layout ${sidebarOpen ? 'sidebar-active' : ''}`}>
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/images/logos/Solid.ico" alt="S" style={{ height: '30px' }} />
                        <span>Solid Admin</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <FaHome /> Dashboard
                    </NavLink>
                    <NavLink to="/admin/categories" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <FaFolder /> Categories
                    </NavLink>
                    <NavLink to="/admin/albums" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <FaImages /> Albums
                    </NavLink>
                    {/* Placeholder links */}
                    <div className="sidebar-link" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <FaEnvelope /> Inquiries
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Header */}
                <header className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none' }}>
                            <FaBars />
                        </button>
                        <div className="breadcrumbs">Admin / {getPageTitle()}</div>
                    </div>

                    <div className="user-menu">
                        <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#6b7280', cursor: 'pointer' }}>
                            <FaBell />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaUserCircle style={{ fontSize: '2rem', color: '#d1d5db' }} />
                            <div style={{ fontSize: '0.9rem', textAlign: 'right' }}>
                                <div style={{ fontWeight: '600' }}>Administrator</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Super User</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
