import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={closeMobileMenu}>
            <img 
              src="/images/logos/logo.png" 
              alt="Solid Weddings Logo" 
              className="logo-image"
            />
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="navigation">
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/about-me" className="nav-link">About Me</Link></li>
            <li><Link to="/services" className="nav-link">Services</Link></li>
            <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
          </ul>
        </nav>

        {/* Desktop Social Media Icons */}
        <div className="social-icons desktop-social">
          <a 
            href="https://www.facebook.com/solidweddingsofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a 
            href="https://www.instagram.com/solidweddingsofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a 
            href="https://wa.me/94712710881" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
          <a 
            href="tel:+94712710881" 
            className="social-link"
          >
            <i className="fas fa-phone"></i>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-menu">
          <li><Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link to="/about-me" className="mobile-nav-link" onClick={closeMobileMenu}>About Me</Link></li>
          <li><Link to="/services" className="mobile-nav-link" onClick={closeMobileMenu}>Services</Link></li>
          <li><Link to="/gallery" className="mobile-nav-link" onClick={closeMobileMenu}>Gallery</Link></li>
          <li><Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link></li>
        </ul>
        
        {/* Mobile Social Media Icons */}
        <div className="mobile-social-icons">
          <a 
            href="https://www.facebook.com/solidweddingsofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mobile-social-link"
            onClick={closeMobileMenu}
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a 
            href="https://www.instagram.com/solidweddingsofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mobile-social-link"
            onClick={closeMobileMenu}
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a 
            href="https://wa.me/94712710881" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mobile-social-link"
            onClick={closeMobileMenu}
          >
            <i className="fab fa-whatsapp"></i>
          </a>
          <a 
            href="tel:+94712710881" 
            className="mobile-social-link"
            onClick={closeMobileMenu}
          >
            <i className="fas fa-phone"></i>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;