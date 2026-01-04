import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGalleryData } from '../services/galleryService';

const Home = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const heroImages = [
    `${import.meta.env.BASE_URL}images/weddings/467502583_943824090943065_7221224242965653699_n.jpg`,
    `${import.meta.env.BASE_URL}images/weddings/453353797_868177951841013_4737084022978926838_n.jpg`,
    `${import.meta.env.BASE_URL}images/weddings/467459120_943824510943023_6632681943136575200_n.jpg`,
    `${import.meta.env.BASE_URL}images/weddings/467744778_943824437609697_1708973942382290310_n.jpg`,
    `${import.meta.env.BASE_URL}images/weddings/467525385_943824337609707_4503835412837400410_n.jpg`
  ];

  // Component mount animation & Data Fetch
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);

    const loadServices = async () => {
      try {
        const { display } = await fetchGalleryData();

        // Description Map from User Mockup
        const descriptionMap = {
          "Wedding": "Complete wedding day coverage capturing every precious moment.",
          "Homecoming": "Beautiful coverage of your homecoming celebration.",
          "Destination": "Capturing your love story in breathtaking locations worldwide.",
          "Private Session": "Intimate and personalized photography sessions for couples.",
          "Bridal": "Elegant portraits focusing on the beauty and style of the bride.",
          "Engagement": "Celebrate your commitment with a romantic engagement session."
        };

        // Simple dedupe logic
        const candidates = new Map();
        display.forEach(cat => {
          const nameKey = cat.displayName.toLowerCase();
          const hasImages = cat.data && cat.data.allImages.length > 0;
          if (!candidates.has(nameKey)) {
            candidates.set(nameKey, cat);
          } else {
            const existing = candidates.get(nameKey);
            const existingHasImages = existing.data && existing.data.allImages.length > 0;
            if (!existingHasImages && hasImages) {
              candidates.set(nameKey, cat);
            }
          }
        });

        const finalServices = Array.from(candidates.values()).map(cat => {
          const title = cat.displayName.charAt(0).toUpperCase() + cat.displayName.slice(1);
          return {
            id: cat.id,
            title: title,
            image: cat.data.allImages[0]?.src || '',
            // Use mapped description or fallback
            description: descriptionMap[title] || `Explore our beautiful ${title} collection.`,
            count: cat.data.allImages.length
          };
        }).filter(s => s.image);

        // Sort to match the user's order if possible (Wedding, Homecoming, Destination...)
        const order = ["Wedding", "Homecoming", "Destination", "Private Session", "Bridal", "Engagement"];
        finalServices.sort((a, b) => {
          const idxA = order.indexOf(a.title);
          const idxB = order.indexOf(b.title);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });

        setServices(finalServices);
      } catch (err) {
        console.error("Failed to load services", err);
      }
    };
    loadServices();

    return () => clearTimeout(timer);
  }, []);

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Smooth parallax using requestAnimationFrame (no state updates, no slow glide)
  useEffect(() => {
    const images = () => Array.from(document.querySelectorAll('.hero-bg-image'));
    let ticking = false;

    const update = () => {
      const sc = window.scrollY || window.pageYOffset;
      // subtle clamped offset
      const offset = Math.max(-100, Math.min(100, sc * 0.25));
      images().forEach(img => {
        const scale = img.classList.contains('active') ? 1.05 : 1;
        img.style.transform = `translateY(${offset}px) scale(${scale})`;
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    // Initialize styles
    images().forEach(img => {
      img.style.transform = 'translateY(0) scale(1.05)';
      img.style.willChange = 'transform, opacity';
      img.style.pointerEvents = 'none';
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll(); // run once initially

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      rootMargin: '120px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = index * 150;
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, delay);
        }
      });
    }, observerOptions);

    // Observe elements with scroll animation
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`home-page ${isLoaded ? 'loaded' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap');
        
        :root {
          --bg: #fdfcfb;
          --text-primary: #2d2d2d;
          --text-muted: #6b6b6b;
          --card: #ffffff;
          --accent-gold: #c0a062;
          --accent-gold-light: #d9c6a5;
          --shadow: 0 16px 50px rgba(45, 45, 45, 0.08);
          --radius: 30px; /* Increased radius based on mockup */
          --header-offset: 90px;
        }

        .home-page {
          font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
          color: var(--text-primary);
          background: var(--bg);
          min-height: 100vh;
          padding-top: var(--header-offset);
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .home-page.loaded { opacity: 1; }

        .home-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at 15% 25%, rgba(192, 160, 98, 0.04) 0%, transparent 40%),
                      radial-gradient(circle at 85% 75%, rgba(192, 160, 98, 0.03) 0%, transparent 40%);
          animation: bgFloat 25s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        @keyframes bgFloat { 0%, 100% { transform: translate(0,0) scale(1) } 50% { transform: translate(-15px, 10px) scale(1.05) } }

        /* Hero Section */
        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-top: calc(var(--header-offset) * -1); /* Pull hero up under header */
          padding-top: var(--header-offset); /* Maintain content spacing */
        }

        .hero-bg-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: opacity 1.2s ease-in-out;
          transform: translateY(0) scale(1.05);
          background-color: #000;
          will-change: transform, opacity;
          pointer-events: none;
        }
        .hero-bg-image.active { opacity: 1; z-index: 2; }
        .hero-bg-image.inactive { opacity: 0; z-index: 1; }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%);
          z-index: 3;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(4rem, 10vw, 8rem);
          font-weight: 700;
          color: #fff;
          text-shadow: 0 4px 30px rgba(0,0,0,0.6);
          margin: 0 0 24px;
          letter-spacing: -0.02em;
          line-height: 1.1;
          animation: titleFadeIn 1.2s ease 0.5s both;
        }
        @keyframes titleFadeIn { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }

        .hero-subtitle {
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 2px 15px rgba(0,0,0,0.4);
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 400;
          margin: 0 0 40px;
          letter-spacing: 0.02em;
          line-height: 1.6;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          animation: subtitleFadeIn 1.2s ease 0.7s both;
        }
        @keyframes subtitleFadeIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }

        .hero-cta {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          animation: ctaFadeIn 1.2s ease 0.9s both;
        }
        @keyframes ctaFadeIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }

        .btn {
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
        }

        .btn-primary {
          background: var(--accent-gold);
          color: #fff;
          border: 2px solid var(--accent-gold);
          box-shadow: 0 12px 40px rgba(192, 160, 98, 0.3);
        }
        .btn-primary:hover {
          background: #a88a4f;
          border-color: #a88a4f;
          transform: translateY(-2px);
          box-shadow: 0 16px 50px rgba(192, 160, 98, 0.4);
        }

        .btn-outline {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        /* Sections */
        .section {
          padding: 80px 0;
          position: relative;
          z-index: 5;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .scroll-animate {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          text-align: center;
          margin-bottom: 60px;
          color: var(--text-primary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .feature-card {
          background: var(--card);
          border-radius: var(--radius);
          padding: 40px 30px;
          text-align: center;
          box-shadow: var(--shadow);
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 70px rgba(45, 45, 45, 0.12);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light));
          border-radius: 50%;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .feature-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .feature-text {
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* Services Preview */
        .services-preview {
          background: linear-gradient(135deg, #f8f6f4 0%, #fdfcfb 100%);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }

        .service-card {
          background: var(--card);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); /* Softer, larger shadow */
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
          border: 1px solid rgba(0,0,0,0.05); /* Subtle border like mockup */
          display: flex;
          flex-direction: column;
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(45, 45, 45, 0.1);
        }

        .service-image {
          width: 100%;
          height: 300px; /* Taller image as per mockup */
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .service-card:hover .service-image {
          transform: scale(1.05);
        }

        .service-content {
          padding: 40px 32px; /* Increased padding */
          text-align: left;   /* Left alignment as per mockup */
          flex: 1;
        }

        .service-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .service-description {
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 0; 
          font-size: 1.05rem;
        }

        .service-price {
            /* Hiding "View Collection" link text style inside dynamic loop if wanted, or styling it here */
            display: none !important; /* Hide the link text to match mockup clean look, or keep it subtle? Mockup doesn't show button. */
        }


        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, var(--accent-gold) 0%, #a88a4f 100%);
          color: #fff;
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 10;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('${import.meta.env.BASE_URL}images/weddings/467502583_943824090943065_7221224242965653699_n.jpg') center/cover;
          opacity: 0.1;
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 24px;
        }

        .cta-text {
          font-size: 1.2rem;
          margin-bottom: 40px;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-cta {
            flex-direction: column;
            align-items: center;
          }
          .btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
          .features-grid,
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`hero-bg-image ${index === currentHeroImage ? 'active' : 'inactive'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">Capturing Love Stories</h1>
          <p className="hero-subtitle">
            Professional wedding photography that preserves your most precious moments with artistic elegance and timeless beauty
          </p>
          <div className="hero-cta">
            <Link to="/gallery" className="btn btn-primary">View Our Work</Link>
            <Link to="/contact" className="btn btn-outline">Book Consultation</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <div className="scroll-animate">
            <h2 className="section-title">Why Choose Us</h2>
            <div className="features-grid">
              <div className="feature-card scroll-animate">
                <div className="feature-icon">📸</div>
                <h3 className="feature-title">Professional Excellence</h3>
                <p className="feature-text">Years of experience capturing wedding moments with artistic vision and technical expertise.</p>
              </div>
              <div className="feature-card scroll-animate">
                <div className="feature-icon">❤️</div>
                <h3 className="feature-title">Personal Touch</h3>
                <p className="feature-text">We take time to understand your story and capture the unique essence of your relationship.</p>
              </div>
              <div className="feature-card scroll-animate">
                <div className="feature-icon">✨</div>
                <h3 className="feature-title">Timeless Quality</h3>
                <p className="feature-text">High-quality images that you'll treasure for generations, delivered with meticulous attention to detail.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section services-preview">
        <div className="container">
          <div className="scroll-animate">
            <h2 className="section-title">Our Services</h2>
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={service.id} className="service-card scroll-animate" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div style={{ overflow: 'hidden' }}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="service-image"
                      className="service-image"
                    />
                  </div>
                  <div className="service-content" onClick={() => navigate('/gallery', { state: { categoryId: service.id } })} style={{ cursor: 'pointer' }}>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    <Link
                      to="/gallery"
                      state={{ categoryId: service.id }} // Pass state if we want Gallery to auto-select (optional enhancement)
                      className="service-price"
                      style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginTop: '10px' }}
                    >
                      View Collection →
                    </Link>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center' }}>Loading services...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="scroll-animate cta-content">
            <h2 className="cta-title">Ready to Begin?</h2>
            <p className="cta-text">Let's create beautiful memories together. Contact us today to discuss your vision and start planning your perfect photography experience.</p>
            <div className="hero-cta">
              <Link to="/contact" className="btn btn-outline">Get Quote</Link>
              <Link to="/services" className="btn btn-outline">View Packages</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;