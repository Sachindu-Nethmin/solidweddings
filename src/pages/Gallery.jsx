import React, { useEffect, useRef, useState } from 'react';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'ceremony', name: 'Ceremony' },
    { id: 'reception', name: 'Reception' },
    { id: 'portraits', name: 'Portraits' },
    { id: 'prewedding', name: 'Pre-Wedding' }
  ];

  const heroImages = [
    '/images/weddings/467502583_943824090943065_7221224242965653699_n.jpg',
    '/images/weddings/453353797_868177951841013_4737084022978926838_n.jpg',
    '/images/weddings/467459120_943824510943023_6632681943136575200_n.jpg',
    '/images/weddings/467744778_943824437609697_1708973942382290310_n.jpg',
    '/images/weddings/467525385_943824337609707_4503835412837400410_n.jpg'
  ];

  const galleryImages = [
    {
      id: 1,
      src: '/images/weddings/453353797_868177951841013_4737084022978926838_n.jpg',
      alt: 'Wedding Ceremony',
      category: 'ceremony'
    },
    {
      id: 2,
      src: '/images/weddings/467459120_943824510943023_6632681943136575200_n.jpg',
      alt: 'Bridal Portrait',
      category: 'portraits'
    },
    {
      id: 3,
      src: '/images/weddings/467744778_943824437609697_1708973942382290310_n.jpg',
      alt: 'Wedding Reception',
      category: 'reception'
    },
    {
      id: 4,
      src: '/images/weddings/467525385_943824337609707_4503835412837400410_n.jpg',
      alt: 'Pre-Wedding Shoot',
      category: 'prewedding'
    },
    {
      id: 5,
      src: '/images/weddings/467525658_943824374276370_7508292422335555957_n.jpg',
      alt: 'Wedding Photography',
      category: 'ceremony'
    },
    {
      id: 6,
      src: '/images/weddings/467581489_943824560943018_1850348283717679066_n.jpg',
      alt: 'Wedding Moments',
      category: 'reception'
    },
    {
      id: 7,
      src: '/images/weddings/467581668_943824124276395_603331384049563710_n.jpg',
      alt: 'Event Photography',
      category: 'reception'
    },
    {
      id: 8,
      src: '/images/weddings/467581955_943824264276381_72587053085497663_n.jpg',
      alt: 'Family Portrait',
      category: 'portraits'
    },
    {
      id: 9,
      src: '/images/weddings/467614283_943824474276360_1770150232184232428_n.jpg',
      alt: 'Wedding Album',
      category: 'portraits'
    },
    {
      id: 10,
      src: '/images/weddings/467615027_943824340943040_3427541276125358098_n.jpg',
      alt: 'Ceremony Moments',
      category: 'ceremony'
    },
    {
      id: 11,
      src: '/images/weddings/467634259_943823987609742_6459301357175723970_n.jpg',
      alt: 'Reception Dance',
      category: 'reception'
    },
    {
      id: 12,
      src: '/images/weddings/467643997_943824010943073_1011805423029436531_n.jpg',
      alt: 'Romantic Portraits',
      category: 'prewedding'
    },
    {
      id: 13,
      src: '/images/weddings/467654997_943824067609734_1941169228740568755_n.jpg',
      alt: 'Bridal Beauty',
      category: 'portraits'
    },
    {
      id: 14,
      src: '/images/weddings/467672116_943824590943015_1177962738152061151_n.jpg',
      alt: 'Wedding Ceremony',
      category: 'ceremony'
    },
    {
      id: 15,
      src: '/images/weddings/467677799_943824407609700_1932569026672383994_n.jpg',
      alt: 'Reception Celebration',
      category: 'reception'
    },
    {
      id: 16,
      src: '/images/weddings/467696682_943824070943067_9155044915667421983_n.jpg',
      alt: 'Couple Portraits',
      category: 'prewedding'
    },
    {
      id: 17,
      src: '/images/weddings/467711436_943824007609740_2453538354038684178_n.jpg',
      alt: 'Elegant Portraits',
      category: 'portraits'
    },
    {
      id: 18,
      src: '/images/weddings/467717505_943824147609726_5116480860040812036_n.jpg',
      alt: 'Sacred Ceremony',
      category: 'ceremony'
    }
  ];

  const filteredImages = selectedCategory === 'all' ? galleryImages : galleryImages.filter(image => image.category === selectedCategory);

  const gridRef = useRef(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [heroAnimated, setHeroAnimated] = useState(false);
  const heroImageRef = useRef(null);

  // IntersectionObserver for scroll-in animations with stagger
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const items = Array.from(gridEl.querySelectorAll('.gallery-item'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger animation by index
          const delay = (Array.from(items).indexOf(entry.target) % 12) * 50;
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay);
        }
      });
    }, { rootMargin: '120px', threshold: 0.08 });

    items.forEach(item => {
      io.observe(item);
    });

    return () => io.disconnect();
  }, [selectedCategory]);

  // hero mount animation
  useEffect(() => {
    const t = setTimeout(() => setHeroAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  // hero image changing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 3500); // Change image every 3.5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // parallax effect for hero image
  useEffect(() => {
    const onScroll = () => {
      const el = heroImageRef.current;
      if (!el) return;
      const sc = window.scrollY || window.pageYOffset;
      // small parallax: move image up to 14px
      const offset = Math.max(-14, Math.min(14, sc * -0.02));
      el.style.transform = `translateY(${offset}px) scale(1.02)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Add mouse tracking for subtle interactive effects
  useEffect(() => {
    // Cache the gallery items when the effect runs
    const cards = document.querySelectorAll('.gallery-item');
    const handleMouseMove = (e) => {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;
          
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;
        } else {
          card.style.transform = '';
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [selectedCategory]);

  // small filter animation: fade grid while filtering
  const setCategory = (cat) => {
    if (cat === selectedCategory) return;
    setIsFiltering(true);
    setTimeout(() => {
      setSelectedCategory(cat);
      setIsFiltering(false);
    }, 220);
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
  };

  // helper to mark image loaded (for fade-in / LQIP)
  const markLoaded = (e) => {
    try { e.currentTarget.setAttribute('data-loaded', 'true'); } catch (err) { console.error('Failed to mark image as loaded:', err); }
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setLightboxImage(filteredImages[prevIndex]);
  };

  return (
    <div className={`gallery-page ${isFiltering ? 'is-filtering' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap');
        
        /* Professional Color Palette & Variables */
        :root {
          --bg: #fdfcfb; /* Softer, warmer background */
          --text-primary: #2d2d2d; /* Softer black for text */
          --text-muted: #6b6b6b;
          --card: #ffffff;
          --accent-gold: #c0a062; /* Muted, elegant gold */
          --accent-gold-light: #d9c6a5;
          --shadow: 0 16px 50px rgba(45, 45, 45, 0.08);
          --radius: 20px;
          --header-offset: 72px;
        }

        .gallery-page {
          font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
          color: var(--text-primary);
          background: var(--bg);
          min-height: 100vh;
          padding-top: var(--header-offset);
          position: relative;
          overflow-x: hidden;
        }
        
        .gallery-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at 15% 25%, rgba(192, 160, 98, 0.04) 0%, transparent 40%),
                      radial-gradient(circle at 85% 75%, rgba(192, 160, 98, 0.03) 0%, transparent 40%);
          animation: bgFloat 25s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        @keyframes bgFloat{ 0%, 100%{ transform:translate(0,0) scale(1) } 50%{ transform:translate(-15px, 10px) scale(1.05) } }

        /* HERO with Increased Transparency */
        .hero-section {
          position: relative;
          height: 65vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hero-bg-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: opacity 3s ease-in-out, transform 3s ease-in-out, filter 3s ease-in-out;
        }
        .hero-bg-image.active { opacity: 1; transform: scale(1.05); filter: blur(0) brightness(0.9); z-index: 2; }
        .hero-bg-image.inactive { opacity: 0; transform: scale(1); filter: blur(10px) brightness(0.9); z-index: 1; }
        
        .hero-overlay-dark {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%);
          z-index: 3;
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          max-width: 960px;
          margin: 0 auto;
        }
        
        /* REMOVED .hero-glass-card styles */
        
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.2rem, 8vw, 6.5rem);
          font-weight: 700;
          color: #fff;
          text-shadow: 0 4px 30px rgba(0,0,0,0.5);
          margin: 0 0 20px;
          letter-spacing: -0.02em;
          line-height: 1.1;
          animation: titleFadeIn 1s ease 0.5s both;
        }
        @keyframes titleFadeIn{ from{ opacity:0; transform:translateY(20px) } to{ opacity:1; transform:translateY(0) } }
        
        .hero-subtitle {
          color: rgba(255, 255, 255, 0.85);
          text-shadow: 0 2px 15px rgba(0,0,0,0.4);
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          font-weight: 400;
          margin: 0 0 28px;
          letter-spacing: 0.02em;
          line-height: 1.5;
          max-width: 640px;
          animation: subtitleFadeIn 1s ease 0.7s both;
        }
        @keyframes subtitleFadeIn{ from{ opacity:0; transform:translateY(15px) } to{ opacity:1; transform:translateY(0) } }
        
        .hero-divider-wrap {
          position: relative;
          width: 112px;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-gold-light), var(--accent-gold), var(--accent-gold-light));
          border-radius: 3px;
          margin: 0 auto 24px;
          animation: dividerScale 0.8s cubic-bezier(0.2, 0.9, 0.2, 1) 0.9s both;
        }
        @keyframes dividerScale{ from{ transform:scaleX(0) } to{ transform:scaleX(1) } }
        
        .hero-nav-dots { display: flex; justify-content: center; gap: 12px; margin-bottom: 16px; animation: dotsFadeIn 1s ease 1.1s both; }
        @keyframes dotsFadeIn{ from{ opacity:0; transform:translateY(10px) } to{ opacity:1; transform:translateY(0) } }
        .hero-dot { position: relative; transition: all 0.5s ease; cursor: pointer; border: none; background: transparent; padding: 0; }
        .hero-dot-inner { width: 10px; height: 10px; border-radius: 50%; transition: all 0.5s ease; }
        .hero-dot.inactive .hero-dot-inner { background: rgba(255, 255, 255, 0.5); }
        .hero-dot.inactive:hover .hero-dot-inner { background: rgba(255, 255, 255, 0.8); transform: scale(1.25); }
        .hero-dot.active { width: 32px; height: 10px; }
        .hero-dot.active .hero-dot-inner { width: 100%; background: var(--accent-gold); box-shadow: 0 2px 10px rgba(192, 160, 98, 0.5); transform: scale(1.1); }
        
        .hero-progress-bar { width: 100%; max-width: 384px; margin: 0 auto; background: rgba(255, 255, 255, 0.25); border-radius: 9999px; height: 3px; overflow: hidden; animation: progressFadeIn 1s ease 1.3s both; }
        @keyframes progressFadeIn{ from{ opacity:0; transform:scaleX(0.8) } to{ opacity:1; transform:scaleX(1) } }
        .hero-progress-fill { height: 100%; background: var(--accent-gold); border-radius: 9999px; transition: width 0.3s linear; }
        
        .hero-bottom-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(180deg, transparent, var(--bg)); pointer-events: none; z-index: 5; }

        /* FILTERS with new colors */
        .gallery-filters { padding: 1.2rem 0 0.6rem; position: relative; z-index: 10; }
        .filter-buttons { display: flex; gap: .6rem; flex-wrap: wrap; justify-content: center; align-items: center; padding: 1rem 0; }
        .filter-btn {
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(45, 45, 45, 0.08);
          padding: .56rem 1rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all .32s cubic-bezier(.2,.9,.2,1);
          font-weight: 600;
          color: var(--text-muted);
        }
        .filter-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(45, 45, 45, 0.07);
          border-color: rgba(192, 160, 98, 0.3);
          color: var(--text-primary);
        }
        .filter-btn.active {
          background: var(--accent-gold);
          border-color: var(--accent-gold);
          box-shadow: 0 12px 40px rgba(192, 160, 98, 0.25);
          color: #fff;
        }

        /* GRID with new colors */
        .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; align-items: start; margin-top: 1.2rem; padding-bottom: 1.2rem; }
        @media (max-width: 1000px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 720px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 420px) { .gallery-grid { grid-template-columns: 1fr; } }

        .gallery-item {
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          cursor: zoom-in;
          min-height: 200px;
          transform: translateY(18px) scale(0.98);
          opacity: 0;
          transition: all .5s cubic-bezier(.2,.9,.2,1);
          transform-style: preserve-3d;
        }
        .gallery-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(240,169,155,0.15) 100%);
          opacity: 0;
          transition: opacity .4s ease;
          pointer-events: none;
          z-index: 2;
        }
        .gallery-item::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, transparent, rgba(240,169,155,0.3), transparent);
          opacity: 0;
          transition: all .6s ease;
          border-radius: var(--radius);
          pointer-events: none;
          z-index: 1;
          animation: shimmer 3s linear infinite;
          animation-play-state: paused;
        }
        @keyframes shimmer{ 0%{ transform:translateX(-100%) } 100%{ transform:translateX(100%) } }
        
        .gallery-item.in-view{ transform:translateY(0) scale(1); opacity:1; }
        .gallery-item:focus{ outline:2px solid rgba(246, 217, 214, 0.6); outline-offset:4px; }
        .gallery-item:hover{ transform:translateY(-8px) scale(1.01); box-shadow: 0 20px 60px rgba(15,15,15,0.12); }
        .gallery-item:hover::before{ opacity:1; }
        .gallery-item:hover::after{ opacity:1; animation-play-state:running; }
        .gallery-item:active{ transform:translateY(-6px) scale(0.99); }

        .media{ position:relative; overflow:hidden; height:100%; display:block; background:linear-gradient(135deg, #f6f1ef 0%, #fffaf8 100%); }
        .gallery-image{ width:100%; height:100%; display:block; object-fit:cover; aspect-ratio:4/3; transition: transform .6s cubic-bezier(.2,.9,.2,1), filter .6s ease, opacity .6s ease; transform-origin:center center; opacity:0; filter:blur(10px) saturate(.94) contrast(.94) brightness(1.02); }
        .gallery-image[data-loaded="true"]{ opacity:1; filter:blur(0) saturate(1) contrast(1) brightness(1); animation: imageReveal .8s cubic-bezier(.2,.9,.2,1) both; }
        @keyframes imageReveal{ 0%{ transform:scale(1.05); opacity:0 } 100%{ transform:scale(1); opacity:1 } }
        .gallery-item.in-view .gallery-image{ opacity:1; }
        .gallery-item:hover .gallery-image{ transform: scale(1.1) rotate(0.5deg); filter:brightness(1.08) saturate(1.06) contrast(1.02); }

        .meta{ position:absolute; left:0; right:0; bottom:0; padding:.9rem 1rem; display:flex; justify-content:space-between; align-items:center; gap:.6rem; background:linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.55)); color:#fff; transform:translateY(16px); opacity:0; transition: all .35s cubic-bezier(.2,.9,.2,1); pointer-events:none; backdrop-filter:blur(2px); }
        .gallery-item:hover .meta{ transform:translateY(0); opacity:1; animation: slideUpBounce .5s cubic-bezier(.2,.9,.2,1) both; }
        @keyframes slideUpBounce{ 0%{ transform:translateY(20px); opacity:0 } 60%{ transform:translateY(-2px); opacity:1 } 100%{ transform:translateY(0); opacity:1 } }
        .meta h3{ margin:0; font-size:1.05rem; font-weight:600; font-family:'Playfair Display', serif; letter-spacing:.015em; text-shadow:0 2px 10px rgba(0,0,0,0.3); animation: textGlow 2s ease-in-out infinite; }
        @keyframes textGlow{ 0%, 100%{ text-shadow:0 2px 10px rgba(0,0,0,0.3) } 50%{ text-shadow:0 2px 16px rgba(240,169,155,0.6), 0 0 20px rgba(240,169,155,0.3) } }
        .meta .tag {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: .3rem .65rem;
          border-radius: 999px;
          font-size: .8rem;
          text-transform: capitalize;
          color: #fff;
          transition: all .3s ease;
        }
        .gallery-item:hover .meta .tag {
          background: rgba(192, 160, 98, 0.2);
          border-color: rgba(192, 160, 98, 0.4);
        }
        
        /* LIGHTBOX with new colors */
        .lightbox { background: rgba(15, 15, 15, 0.88); backdrop-filter: blur(8px); }
        .lightbox-close, .lightbox-prev, .lightbox-next { background: rgba(253, 252, 251, 0.9); color: var(--text-primary); }
        .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover { background: #fff; }

        /* CTA with new colors */
        .gallery-cta { padding: 3.5rem 0 6rem; text-align: center; background: transparent; }
        .cta-content h2 { color: var(--text-primary); }
        .cta-content p { color: var(--text-muted); }
        .btn-primary {
          background: var(--accent-gold);
          color: #fff;
          box-shadow: 0 12px 40px rgba(192, 160, 98, 0.2);
        }
        .btn-primary:hover {
          background: #a88a4f; /* Darker gold on hover */
          box-shadow: 0 16px 50px rgba(192, 160, 98, 0.3);
        }
        .btn-outline {
          border: 2px solid rgba(45, 45, 45, 0.15);
          color: var(--text-primary);
        }
        .btn-outline:hover {
          border-color: var(--accent-gold);
          background: rgba(192, 160, 98, 0.05);
        }

        /* Filtering state */
        .is-filtering .gallery-item{ opacity:.28; transform:scale(.995); }

        /* Modern image transitions */
        @keyframes slideInFromLeft{ from{ opacity:0; transform:translateX(-50px) scale(0.9) } to{ opacity:1; transform:translateX(0) scale(1) } }
        @keyframes slideInFromRight{ from{ opacity:0; transform:translateX(50px) scale(0.9) } to{ opacity:1; transform:translateX(0) scale(1) } }
        @keyframes fadeInScale{ from{ opacity:0; transform:scale(0.8) } to{ opacity:1; transform:scale(1) } }
        @keyframes rotateIn{ from{ opacity:0; transform:rotate(-10deg) scale(0.9) } to{ opacity:1; transform:rotate(0deg) scale(1) } }
      `}</style>
      
      {/* HERO SECTION - FIXED */}
      <section className="hero-section">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`hero-bg-image ${index === currentHeroImage ? 'active' : 'inactive'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        {/* Overlays */}
        <div className="hero-overlay-dark"></div>

        {/* Content */}
        <div className="hero-content-wrapper">
            <h1 className="hero-title">Our Gallery</h1>
            <p className="hero-subtitle">Capturing love stories through timeless, romantic imagery</p>
            
            <div className="hero-divider-wrap">
              <div className="hero-divider-shine"></div>
            </div>

            {/* Navigation Dots */}
            <div className="hero-nav-dots">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  className={`hero-dot ${index === currentHeroImage ? 'active' : 'inactive'}`}
                  onClick={() => setCurrentHeroImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <div className="hero-dot-inner"></div>
                  {index === currentHeroImage && <div className="dot-ping"></div>}
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="hero-progress-bar">
              <div 
                className="hero-progress-fill"
                style={{ width: `${((currentHeroImage + 1) / heroImages.length) * 100}%` }}
              ></div>
            </div>
        </div>

        {/* Bottom Fade */}
        <div className="hero-bottom-fade"></div>
      </section>

      {/* FILTERS */}
      <section className="gallery-filters">
        <div className="container">
          <div className="filter-buttons" data-active={selectedCategory !== ''}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setCategory(category.id)}
                aria-pressed={selectedCategory === category.id}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="gallery-grid-section">
        <div className="container">
          <div ref={gridRef} className="gallery-grid">
            {filteredImages.map(image => (
              <article
                key={image.id}
                className="gallery-item"
                onClick={() => openLightbox(image)}
                tabIndex={0}
                role="button"
                aria-label={`Open ${image.alt}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(image); }}
              >
                <div className="media">
                  <img src={image.src} alt={image.alt} className="gallery-image" loading="lazy" onLoad={markLoaded} data-loaded="false" />
                </div>
                <div className="meta">
                  <h3>{image.alt}</h3>
                  <span className="tag">{image.category}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX (improved, keyboard navigable) */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox} role="dialog" aria-modal="true">
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">×</button>
            <button className="lightbox-prev" onClick={prevImage} aria-label="Previous">‹</button>
            <div className="lightbox-image-wrap">
              <img src={lightboxImage.src} alt={lightboxImage.alt} className="lightbox-image" />
              <figcaption className="lightbox-caption">{lightboxImage.alt}</figcaption>
            </div>
            <button className="lightbox-next" onClick={nextImage} aria-label="Next">›</button>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="gallery-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Capture Your Story?</h2>
            <p>Every moment deserves to be beautifully preserved. Let's create timeless memories that you'll cherish forever.</p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">Book Your Session</a>
              <a href="/services" className="btn btn-outline">View Our Packages</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;