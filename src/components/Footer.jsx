import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Get in Touch</h3>
          <p>
            <i className="fas fa-phone"></i>
            <a href="tel:+94712710881">+94 71 271 0881</a>
          </p>
          <p>
            <i className="fas fa-envelope"></i>
            <a href="mailto:solidweddingsofficial@gmail.com">solidweddingsofficial@gmail.com</a>
          </p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-links">
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
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about-me">About Me</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2025 Solid Weddings. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;