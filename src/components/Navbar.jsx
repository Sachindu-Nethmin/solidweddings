import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/about-me', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navClass = `nav ${isHome && !scrolled ? 'light' : 'solid'}${scrolled ? ' scrolled' : ''}`;

  return (
    <nav className={navClass} id="nav">
      {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 498 }} />}
      <div className="container-lg nav-inner">
        <Link to="/" className="brand">
          <img src={`${import.meta.env.BASE_URL}assets/logo-white.png`} className="brand-logo brand-logo-light" alt="Solid Weddings" />
          <img src={`${import.meta.env.BASE_URL}assets/logo-ink.png`} className="brand-logo brand-logo-solid" alt="Solid Weddings" />
        </Link>

        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
          {NAV_ITEMS.map(n => (
            <Link
              key={n.path}
              to={n.path}
              className={location.pathname === n.path ? 'active' : ''}
            >
              {n.label}
            </Link>
          ))}
          <Link to="/client/login" className="nav-login-link">
            Client Login
          </Link>
        </div>

        <button
          className="nav-toggle"
          aria-label="Menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>
      </div>
    </nav>
  );
}
