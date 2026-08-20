import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import '../styles/Gallery.css';
import { fetchGalleryData } from '../services/galleryService';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import Footer from '../components/Footer.jsx';
import { useReveal } from '../components/useReveal.js';

const Gallery = () => {
  const [galleryData, setGalleryData] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState([]);

  useReveal([categories]);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const { raw, display } = await fetchGalleryData();
        setGalleryData(raw);
        setCategories(display);

        const baseUrl = import.meta.env.BASE_URL;
        const allImgs = Object.values(raw).flatMap(cat => cat.allImages || []);
        const heroModules = import.meta.glob('../../public/images/weddings/**/*.{jpg,jpeg,png,webp,avif}');
        const weddingList = [];
        for (const path in heroModules) {
          weddingList.push(`${baseUrl.replace(/\/$/, '')}${path.replace('../../public', '')}`);
        }
        const clientUrls = new Set(allImgs.map(img => img.src));
        const uniqueWeddings = weddingList.filter(url => !clientUrls.has(url));
        const combined = [...allImgs.map(img => img.src), ...uniqueWeddings];
        if (combined.length > 0) {
          const shuffled = combined.sort(() => 0.5 - Math.random());
          setHeroImages(shuffled.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading images:', err);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  const openLightbox = (img) => { setLightboxImage(img); document.body.style.overflow = 'hidden'; };
  const closeLightbox = () => { setLightboxImage(null); document.body.style.overflow = ''; };

  const getContextImages = () => {
    if (!selectedCategory || !galleryData[selectedCategory]) return [];
    if (selectedAlbum) return galleryData[selectedCategory].albums[selectedAlbum] || [];
    return galleryData[selectedCategory].allImages;
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const imgs = getContextImages();
    if (!lightboxImage || imgs.length === 0) return;
    const idx = imgs.findIndex(i => i.id === lightboxImage.id);
    setLightboxImage(imgs[(idx + 1) % imgs.length]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const imgs = getContextImages();
    if (!lightboxImage || imgs.length === 0) return;
    const idx = imgs.findIndex(i => i.id === lightboxImage.id);
    setLightboxImage(imgs[(idx - 1 + imgs.length) % imgs.length]);
  };

  return (
    <div className="page-enter">
      <HeroSlideshow images={heroImages} height="58vh">
        <div className="reveal active">
          <h1 style={{ marginBottom: 16 }}>Our <em>Gallery</em></h1>
          <p style={{ fontSize: 18, opacity: .9, letterSpacing: '.05em' }}>Explore our collection of timeless memories</p>
        </div>
      </HeroSlideshow>

      <div className="container-lg" style={{ padding: '3rem 2rem', minHeight: '50vh' }}>
        <div className="category-filters" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <button className={`filter-btn${selectedCategory === null ? ' active' : ''}`}
            onClick={() => { setSelectedCategory(null); setSelectedAlbum(null); }}
            style={{ padding: '10px 24px', borderRadius: 30, border: '1px solid var(--cream-3)', background: selectedCategory === null ? 'var(--ink)' : 'transparent', color: selectedCategory === null ? '#fff' : 'var(--ink-3)', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all .3s ease' }}>
            All Albums
          </button>
          {categories.map(cat => (
            <button key={cat.id} className={`filter-btn${selectedCategory === cat.id ? ' active' : ''}`}
              onClick={() => { setSelectedCategory(cat.id); setSelectedAlbum(null); }}
              style={{ padding: '10px 24px', borderRadius: 30, border: '1px solid var(--cream-3)', background: selectedCategory === cat.id ? 'var(--ink)' : 'transparent', color: selectedCategory === cat.id ? '#fff' : 'var(--ink-3)', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all .3s ease' }}>
              {cat.displayName}
            </button>
          ))}
        </div>

        {/* ROOT VIEW */}
        {!selectedCategory && (
          <div className="albums-grid" style={{ animation: 'fadeIn 0.8s ease' }}>
            {categories.length === 0 ? (
              <div style={{ width: '100%', textAlign: 'center', color: 'var(--ink-3)' }}>{loading ? 'Loading...' : 'No images found.'}</div>
            ) : categories.map(cat => {
              const catData = galleryData[cat.id];
              if (!catData) return null;
              const cover = catData.allImages[0]?.src;
              return (
                <div key={cat.id} className="album-card reveal" onClick={() => { setSelectedCategory(cat.id); setSelectedAlbum(null); }}
                  style={{ borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer', background: 'var(--cream)', boxShadow: '0 4px 20px rgba(0,0,0,.06)', transition: 'transform .3s ease' }}>
                  <div className="album-cover" style={{ height: 300, overflow: 'hidden' }}>
                    {cover ? <img src={cover} alt={cat.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}>Empty</div>}
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{cat.displayName}</h3>
                    <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{catData.allImages.length} Photos</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CATEGORY VIEW */}
        {selectedCategory && !selectedAlbum && galleryData[selectedCategory] && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => setSelectedCategory(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--gold-text)', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 32 }}>
              <FaArrowLeft /> Back to Categories
            </button>
            <h2 style={{ marginBottom: 32 }}>{categories.find(c => c.id === selectedCategory)?.displayName || selectedCategory}</h2>
            <div className="albums-grid">
              {Object.keys(galleryData[selectedCategory].albums).map(albumName => {
                const imgs = galleryData[selectedCategory].albums[albumName];
                if (imgs.length === 0) return null;
                return (
                  <div key={albumName} className="album-card" onClick={() => setSelectedAlbum(albumName)}
                    style={{ borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer', background: 'var(--cream)', boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
                    <div className="album-cover" style={{ height: 280, overflow: 'hidden' }}>
                      <img src={imgs[0].src} alt={albumName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 20 }}>
                      <h3 style={{ fontSize: 18, marginBottom: 4 }}>{albumName}</h3>
                      <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{imgs.length} Photos</span>
                    </div>
                  </div>
                );
              })}
              {Object.keys(galleryData[selectedCategory].albums).length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--ink-3)' }}>No albums in this category yet.</div>
              )}
            </div>
          </div>
        )}

        {/* ALBUM VIEW */}
        {selectedCategory && selectedAlbum && galleryData[selectedCategory] && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => setSelectedAlbum(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--gold-text)', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 32 }}>
              <FaArrowLeft /> Back to {categories.find(c => c.id === selectedCategory)?.displayName || selectedCategory}
            </button>
            <h2 style={{ marginBottom: 32 }}>{selectedAlbum === 'General' ? categories.find(c => c.id === selectedCategory)?.displayName : selectedAlbum}</h2>
            <div className="gallery-grid">
              {galleryData[selectedCategory].albums[selectedAlbum].map(img => (
                <div key={img.id} className="gallery-item" onClick={() => openLightbox(img)}
                  style={{ borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer' }}>
                  <div className="media"><img src={img.src} alt={img.alt} loading="lazy" /></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={closeLightbox} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', zIndex: 10 }}><FaTimes /></button>
          <button onClick={prevImage} style={{ position: 'absolute', left: 20, background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer', padding: 16 }}><FaChevronLeft /></button>
          <img src={lightboxImage.src} onClick={e => e.stopPropagation()} alt="" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={nextImage} style={{ position: 'absolute', right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer', padding: 16 }}><FaChevronRight /></button>
        </div>
      )}

      <section className="section-padding" style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="container-lg" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: '#fff', marginBottom: 24 }}>Ready to Capture Your <em>Story?</em></h2>
            <p style={{ maxWidth: 600, margin: '0 auto 40px', opacity: .8 }}>Let's create timeless memories that you'll cherish forever.</p>
            <Link to="/contact" className="btn-gold-outline" style={{ borderColor: '#fff', color: '#fff' }}>Book Your Session</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
