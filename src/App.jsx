import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Admin imports
import AdminLogin from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import DashboardHome from './admin/pages/DashboardHome';
import CategoryManager from './admin/pages/CategoryManager';
import AlbumManager from './admin/pages/AlbumManager';
import AlbumEditor from './admin/pages/AlbumEditor';

import './App.css';

// Protected Route Wrapper
const useAdminAuth = () => {
  const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuth;
};

const ProtectedAdminRoute = ({ children }) => {
  if (!useAdminAuth()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Auto-fix double slashes
  useEffect(() => {
    if (path.match(/\/{2,}/)) {
      const newPath = path.replace(/\/+/g, '/');
      navigate(newPath, { replace: true });
    }
  }, [path, navigate]);

  const isAdminRoute = path.replace(/\/+/g, '/').toLowerCase().startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header />}

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about-me" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Panel Layout & Nested Routes */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="albums" element={<AlbumManager />} />
            <Route path="albums/create" element={<AlbumEditor />} />
            <Route path="albums/edit/:id" element={<AlbumEditor />} />
            {/* Fallback for sub-routes */}
            <Route path="*" element={<DashboardHome />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
