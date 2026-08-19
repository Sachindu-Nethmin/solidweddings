import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container" >
        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Get in Touch</h3>
          <p>
            <i className="fas fa-phone" ></i>
            <a href="tel:+94702288999">+94 70 228 8999</a>
          </p>
          <p>
            <i className="fas fa-envelope"></i>
            <a href="mailto:solidwedding@gmail.com">solidwedding@gmail.com</a>
          </p>
        </div>
        
        {/* Social Media Icons */}
        <div className="social-icons-footer">
          <h3>Follow Us</h3>
          <div className="social-links-row">
            <a 
              href="https://web.facebook.com/solidweddings" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href="https://www.instagram.com/solid_weddings/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="https://wa.me/+94702288999" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
            <a 
              href="tel:+94702288999" 
              className="social-link"
            >
              <i className="fas fa-phone"></i>
            </a>
          </div>
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