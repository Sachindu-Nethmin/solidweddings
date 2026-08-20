import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import DashboardHome from './admin/pages/DashboardHome';
import CategoryManager from './admin/pages/CategoryManager';
import AlbumManager from './admin/pages/AlbumManager';
import AlbumEditor from './admin/pages/AlbumEditor';
import ClientManager from './admin/pages/ClientManager';
import { ClientAuthProvider } from './contexts/ClientAuthContext';
import { AdminAuthProvider, AdminRouteGuard } from './contexts/AdminAuthContext';
import ClientLogin from './pages/client/ClientLogin';
import ClientDashboard from './pages/client/ClientDashboard';
import GalleryDetail from './pages/client/GalleryDetail';
import './App.css';

function App() {
  return (
    <HashRouter>
      <ClientAuthProvider>
        <AdminAuthProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navbar /><main className="main-content"><Home /></main></>} />
              <Route path="/about-me" element={<><Navbar /><main className="main-content"><About /></main></>} />
              <Route path="/services" element={<><Navbar /><main className="main-content"><Services /></main></>} />
              <Route path="/gallery" element={<><Navbar /><main className="main-content"><Gallery /></main></>} />
              <Route path="/contact" element={<><Navbar /><main className="main-content"><Contact /></main></>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={
                <AdminRouteGuard>
                  <AdminLayout />
                </AdminRouteGuard>
              }>
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="albums" element={<AlbumManager />} />
                <Route path="albums/:categoryId/:albumId" element={<AlbumEditor />} />
                <Route path="clients" element={<ClientManager />} />
              </Route>

              {/* Client Routes */}
              <Route path="/client/login" element={<ClientLogin />} />
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/gallery/:categoryId/:albumId" element={<GalleryDetail />} />
            </Routes>
          </div>
        </AdminAuthProvider>
      </ClientAuthProvider>
    </HashRouter>
  );
}

export default App;
