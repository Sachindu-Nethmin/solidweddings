import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.header 
      className={`header modern-header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-container">
        {/* Logo */}
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/">
            <img 
              src="/images/logos/logo.png" 
              alt="Solid Weddings Logo" 
              className="logo-image"
            />
            <span className="logo-text">SOLID WEDDINGS</span>
          </Link>
        </motion.div>

        {/* Navigation Menu */}
        <nav className={`navigation ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-menu">
            <motion.li whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                🏠 Home
              </Link>
            </motion.li>
            <motion.li whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/about-me" 
                className={`nav-link ${isActive('/about-me') ? 'active' : ''}`}
              >
                👤 About Me
              </Link>
            </motion.li>
            <motion.li whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/services" 
                className={`nav-link ${isActive('/services') ? 'active' : ''}`}
              >
                📦 Services
              </Link>
            </motion.li>
            <motion.li whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/gallery" 
                className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
              >
                📸 Gallery
              </Link>
            </motion.li>
            <motion.li whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/contact" 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              >
                📞 Contact
              </Link>
            </motion.li>
          </ul>
        </nav>

        {/* Social Media Icons */}
        <div className="social-icons">
          <motion.a 
            href="https://www.facebook.com/solidweddingsofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaFacebookF />
          </motion.a>
          <motion.a 
            href="https://www.instagram.com/solidweddingsofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaInstagram />
          </motion.a>
          <motion.a 
            href="https://wa.me/94712710881" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaWhatsapp />
          </motion.a>
          <motion.a 
            href="tel:+94712710881" 
            className="social-link phone-link"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPhoneAlt />
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;