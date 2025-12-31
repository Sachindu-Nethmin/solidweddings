import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import '../styles/Gallery.css';

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
  const heroImageRef = useRef(null);

  // --- LOCAL IMAGE LOADING (New Logic) ---
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const modules = import.meta.glob('/public/images/photos/**/*.{jpg,jpeg,png,webp,avif}');
        const grouped = {};
        const allImagesList = [];

        for (const path in modules) {
          const parts = path.split('/');
          const photosIndex = parts.indexOf('photos');

          if (photosIndex !== -1 && parts.length > photosIndex + 2) {
            const category = parts[photosIndex + 1];
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
            allImagesList.push(imgObj);
          }
        }

        setImagesByCategory(grouped);
        setCategories(Object.keys(grouped));

        // Set Hero Images (Random 5)
        if (allImagesList.length > 0) {
          const shuffled = [...allImagesList].sort(() => 0.5 - Math.random());
          setHeroImages(shuffled.slice(0, 5).map(img => img.src));
        }

      } catch (err) {
        console.error("Error loading images:", err);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  // --- HERO ANIMATIONS (Old Logic) ---
  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    const onScroll = () => {
      const el = heroImageRef.current;
      if (!el) return;
      const sc = window.scrollY || window.pageYOffset;
      const offset = Math.max(-14, Math.min(14, sc * -0.02));
      el.style.transform = `translateY(${offset}px) scale(1.02)`;
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
      {/* 1. HERO SECTION (RESTORED) */}
      <section className="hero-section" style={{ height: '60vh', minHeight: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`hero-bg-image ${index === currentHeroImage ? 'active' : 'inactive'}`}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: index === currentHeroImage ? 1 : 0, transition: 'opacity 1s ease'
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}></div>
        <div className="hero-content" style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white' }}>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ fontSize: '4rem', fontFamily: 'serif', marginBottom: '1rem' }}
          >
            Our Gallery
          </motion.h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Capturing love stories through timeless, romantic imagery</p>
        </div>
      </section>

      {/* 2. GALLERY CONTENT (NEW LOGIC) */}
      <div className="gallery-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* VIEW A: ALBUMS */}
        {!selectedCategory && (
          <motion.div className="albums-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {categories.length === 0 ? (
              <div>No images found. Please check public/images/photos folder.</div>
            ) : (
              categories.map(cat => {
                const cover = imagesByCategory[cat][0]?.src;
                return (
                  <motion.div
                    key={cat}
                    className="album-card"
                    onClick={() => setSelectedCategory(cat)}
                    whileHover={{ y: -5 }}
                  >
                    <div className="album-cover">
                      <img src={cover} alt={cat} />
                    </div>
                    <div className="album-info">
                      <h3>{cat}</h3>
                      <span>{imagesByCategory[cat].length} Photos</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* VIEW B: PHOTOS */}
        {selectedCategory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="category-header">
              <button className="back-btn" onClick={() => setSelectedCategory(null)}><FaArrowLeft /> Back</button>
              <h2>{selectedCategory}</h2>
            </div>
            <div className="gallery-grid">
              {imagesByCategory[selectedCategory].map(img => (
                <div key={img.id} className="gallery-item" onClick={() => openLightbox(img)}>
                  <div className="media"><img src={img.src} alt={img.alt} loading="lazy" /></div>
                  <div className="meta"><h3>{img.alt}</h3></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 3. LIGHTBOX */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}><FaTimes /></button>
            <button className="nav-btn prev" onClick={prevImage}><FaChevronLeft /></button>
            <img src={lightboxImage.src} className="lightbox-image" onClick={e => e.stopPropagation()} />
            <button className="nav-btn next" onClick={nextImage}><FaChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CTA SECTION (RESTORED) */}
      <section className="gallery-cta">
        <div className="cta-content">
          <h2>Ready to Capture Your Story?</h2>
          <p>Let's create timeless memories that you'll cherish forever.</p>
          <div className="cta-buttons">
            <a href="/contact" className="btn btn-primary">Book Your Session</a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Gallery;