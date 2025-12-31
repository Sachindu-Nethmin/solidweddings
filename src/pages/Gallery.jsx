import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import '../styles/Gallery.css'; // Keep existing gallery grid styles

const Gallery = () => {
  // --- STATE ---
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hero State
  const [heroImages, setHeroImages] = useState([]);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroRef = useRef(null);

  // --- LOCAL IMAGE LOADING ---
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        // 1. Fetch Gallery Images (from photos folder)
        // Use relative path to avoid 'public' prefix issues if possible, or keep as is if working
        const modules = import.meta.glob('/public/images/photos/**/*.{jpg,jpeg,png,webp,avif}');
        const grouped = {};

        for (const path in modules) {
          const parts = path.split('/');
          const photosIndex = parts.indexOf('photos');

          if (photosIndex !== -1 && parts.length > photosIndex + 2) {
            // Use immediate parent as category
            const category = decodeURIComponent(parts[parts.length - 2]);
            const filename = parts[parts.length - 1];
            const src = path.replace('/public', '');

            if (!grouped[category]) grouped[category] = [];

            const imgObj = {
              id: src,
              src: src,
              alt: filename.split('.')[0],
              category: category
            };
            grouped[category].push(imgObj);
          }
        }

        setImagesByCategory(grouped);
        setCategories(Object.keys(grouped));

        // 2. Fetch Hero Images (specifically from weddings folder)
        // Note: Using relative path from src/pages to public/images/weddings
        const heroModules = import.meta.glob('../../public/images/weddings/**/*.{jpg,jpeg,png,webp,avif}');
        const heroList = [];

        for (const path in heroModules) {
          // path is like '../../public/images/weddings/file.jpg'
          // We need '/images/weddings/file.jpg'
          const cleanPath = path.replace('../../public', '');
          heroList.push(cleanPath);
        }

        // Shuffle and pick 5 random images for Hero
        if (heroList.length > 0) {
          const shuffled = heroList.sort(() => 0.5 - Math.random());
          setHeroImages(shuffled.slice(0, 5));
        }

      } catch (err) {
        console.error("Error loading images:", err);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  // --- HERO LOGIC (From Home.jsx) ---

  // Image Rotation
  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 7000); // Slower interval (7 seconds)
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Smooth Parallax (From Home.jsx)
  useEffect(() => {
    const images = () => Array.from(document.querySelectorAll('.hero-bg-image'));
    let ticking = false;

    const update = () => {
      const sc = window.scrollY || window.pageYOffset;
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

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  // --- HANDLERS ---
  const openLightbox = (image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (!selectedCategory || !lightboxImage) return;
    const currentList = imagesByCategory[selectedCategory];
    const currentIndex = currentList.findIndex(img => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % currentList.length;
    setLightboxImage(currentList[nextIndex]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!selectedCategory || !lightboxImage) return;
    const currentList = imagesByCategory[selectedCategory];
    const currentIndex = currentList.findIndex(img => img.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    setLightboxImage(currentList[prevIndex]);
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="gallery-page">
      {/* Porting CSS from Home.jsx for Hero Section */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap');
        
        /* Shared Variables - matching Home.jsx */
        :root {
          --bg: #fdfcfb;
          --text-primary: #2d2d2d;
          --text-muted: #6b6b6b;
          --accent-gold: #c0a062;
          --accent-gold-light: #d9c6a5;
          --header-offset: 90px;
        }

        /* Hero Section Styles Copied from Home.jsx */
        .hero-section {
          position: relative;
          height: 100vh; /* Full height like Home */
          min-height: 700px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-top: calc(var(--header-offset) * -1);
          padding-top: var(--header-offset);
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

        /* Animation Keyframes */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* CTA Section Variables (reusing hero vars) */
        /* CTA Styles from Home.jsx */
        .cta-section {
          background: linear-gradient(135deg, var(--accent-gold) 0%, #a88a4f 100%);
          color: #fff;
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 10;
          padding: 80px 0;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          /* Use a fallback image or one of the gallery images for background pattern */
          background: url('/images/weddings/467502583_943824090943065_7221224242965653699_n.jpg') center/cover;
          opacity: 0.1;
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
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
        
        .hero-cta {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

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
      `}</style>

      {/* 1. HERO SECTION (HOME STYLE) */}
      <section ref={heroRef} className="hero-section">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`hero-bg-image ${index === currentHeroImage ? 'active' : 'inactive'}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Our Gallery</h1>
          <p className="hero-subtitle">Explore our collection of timeless memories</p>
        </div>
      </section>

      {/* 2. GALLERY CONTENT */}
      <div className="gallery-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem', minHeight: '50vh' }}>

        {/* VIEW A: ALBUMS */}
        {!selectedCategory && (
          <div className="albums-grid" style={{ animation: 'fadeIn 0.8s ease' }}>
            {categories.length === 0 ? (
              <div>No images found. Please check public/images/photos folder.</div>
            ) : (
              categories.map(cat => {
                const cover = imagesByCategory[cat][0]?.src;
                return (
                  <div
                    key={cat}
                    className="album-card"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className="album-cover">
                      <img src={cover} alt={cat} />
                    </div>
                    <div className="album-info">
                      <h3>{cat}</h3>
                      <span>{imagesByCategory[cat].length} Photos</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* VIEW B: PHOTOS */}
        {selectedCategory && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="category-header">
              <button className="back-btn" onClick={() => setSelectedCategory(null)}>
                <FaArrowLeft /> Back to Albums
              </button>
              <h2>{selectedCategory}</h2>
            </div>
            <div className="gallery-grid">
              {imagesByCategory[selectedCategory].map(img => (
                <div key={img.id} className="gallery-item" onClick={() => openLightbox(img)}>
                  <div className="media"><img src={img.src} alt={img.alt} loading="lazy" /></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. LIGHTBOX */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}><FaTimes /></button>
          <button className="nav-btn prev" onClick={prevImage}><FaChevronLeft /></button>
          <img src={lightboxImage.src} className="lightbox-image" onClick={e => e.stopPropagation()} alt="" />
          <button className="nav-btn next" onClick={nextImage}><FaChevronRight /></button>
        </div>
      )}

      {/* 4. CTA SECTION (Updated to Home Style) */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Capture Your Story?</h2>
          <p className="cta-text">Let's create timeless memories that you'll cherish forever.</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-outline">Book Your Session</a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Gallery;