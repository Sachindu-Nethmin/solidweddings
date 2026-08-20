import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-lg">
        <div className="footer-grid">
          <div>
            <img src={`${import.meta.env.BASE_URL}assets/logo-white.png`} alt="Solid Weddings" className="footer-logo" style={{ filter: 'brightness(0) invert(1)', height: 38, width: 'auto', marginBottom: 20 }} />
            <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 300 }}>
              Timeless wedding photography that preserves your most precious moments with artistic elegance and soulful beauty.
            </p>
            <div className="footer-social" style={{ marginTop: 24 }}>
              <a href="https://web.facebook.com/solidweddings" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f" /></a>
              <a href="https://www.instagram.com/solid_weddings/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /></a>
              <a href="https://wa.me/+94702288999" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp" /></a>
              <a href="tel:+94702288999"><i className="fas fa-phone" /></a>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/about-me">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+94702288999"><i className="fas fa-phone" style={{ marginRight: 8, color: 'var(--gold)' }} />+94 70 228 8999</a></li>
              <li><a href="mailto:solidwedding@gmail.com"><i className="fas fa-envelope" style={{ marginRight: 8, color: 'var(--gold)' }} />solidwedding@gmail.com</a></li>
              <li><i className="fas fa-map-marker-alt" style={{ marginRight: 8, color: 'var(--gold)' }} />Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Solid Weddings. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Crafted with <i className="fas fa-heart" style={{ color: 'var(--gold)', fontSize: 10 }} /> in Sri Lanka</span>
            <Link to="/admin/login" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
