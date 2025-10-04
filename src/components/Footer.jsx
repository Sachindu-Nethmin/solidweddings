import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer modern-footer">
      <div className="footer-top">
        <div className="footer-container">
          {/* Brand Section */}
          <motion.div 
            className="footer-section brand-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-logo">
              <img 
                src="/images/logos/logo.png" 
                alt="Solid Weddings Logo" 
                className="footer-logo-image"
              />
              <h2 className="footer-brand">SOLID WEDDINGS</h2>
            </div>
            <p className="footer-tagline">
              ✨ Capturing love stories, one frame at a time. Making your special moments last forever.
            </p>
            <div className="footer-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Couples</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Events Covered</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="footer-section links-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">🏠 Home</Link></li>
              <li><Link to="/about-me">👤 About Me</Link></li>
              <li><Link to="/services">📦 Services</Link></li>
              <li><Link to="/gallery">📸 Gallery</Link></li>
              <li><Link to="/contact">📞 Contact</Link></li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div 
            className="footer-section services-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Our Services</h3>
            <ul className="footer-services">
              <li>💒 Wedding Photography</li>
              <li>🎥 Cinematography</li>
              <li>💑 Pre-Wedding Shoots</li>
              <li>🎉 Event Coverage</li>
              <li>📸 Portrait Photography</li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="footer-section contact-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3>Get in Touch</h3>
            <div className="footer-contact">
              <a href="tel:+94712710881" className="contact-item">
                <FaPhoneAlt />
                <span>+94 71 271 0881</span>
              </a>
              <a href="mailto:solidweddingsofficial@gmail.com" className="contact-item">
                <FaEnvelope />
                <span>solidweddingsofficial@gmail.com</span>
              </a>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Sri Lanka</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-links" style={{ flexDirection: 'row', display: 'flex' }}>
                <motion.a 
                  href="https://www.facebook.com/solidweddingsofficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link facebook"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaFacebookF />
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/solidweddingsofficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link instagram"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaInstagram />
                </motion.a>
                <motion.a 
                  href="https://wa.me/94712710881" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link whatsapp"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaWhatsapp />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p>
            &copy; {currentYear} Solid Weddings. All Rights Reserved. 
            <span className="made-with">
              Made with <FaHeart className="heart-icon" /> in Sri Lanka
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;