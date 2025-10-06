import React, { useEffect, useRef, useState } from 'react';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'ceremony', name: 'Ceremony' },
    { id: 'reception', name: 'Reception' },
    { id: 'portraits', name: 'Portraits' },
    { id: 'prewedding', name: 'Pre-Wedding' }
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
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.gallery-item');
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
        :root{ --bg:#fffaf8; --muted:#f6f1ef; --card:#ffffff; --accent:#f7e9e6; --radius:16px; --shadow: 0 12px 40px rgba(15,15,15,0.06); --header-offset:72px; }
        .gallery-page{ font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial; color:#222; background:var(--bg); min-height:100vh; padding-top:var(--header-offset); position:relative; overflow-x:hidden; }
        
        /* Animated background particles */
        .gallery-page::before{ content:''; position:fixed; inset:0; background: radial-gradient(circle at 20% 50%, rgba(240,169,155,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,177,164,0.04) 0%, transparent 50%); animation: bgFloat 20s ease-in-out infinite; z-index:0; pointer-events:none; }
        @keyframes bgFloat{ 0%, 100%{ transform:translate(0,0) scale(1) } 50%{ transform:translate(-10px,-10px) scale(1.05) } }

        /* HERO */
        .page-hero{ position:relative; height:34vh; min-height:200px; display:flex; align-items:center; justify-content:center; overflow:hidden; border-bottom-left-radius:28px; border-bottom-right-radius:28px; }
        .page-hero::before{ content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0.18), rgba(255,255,255,0.02)); z-index:1; pointer-events:none; }
  .hero-image{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(.84) saturate(.98); transform:scale(1.02); transition: transform .9s ease; }
  .hero-overlay{ position:relative; z-index:2; text-align:center; padding:2.2rem 1rem; display:flex; align-items:center; justify-content:center; }
        .hero-content{ max-width:920px; margin:0 auto; background:transparent; display:flex; flex-direction:column; align-items:center; gap:.6rem; }
        .hero-card{ background: rgba(255,255,255,0.92); padding:1.8rem 2rem; border-radius:16px; box-shadow: 0 20px 60px rgba(18,18,18,0.08); backdrop-filter: blur(6px); transform: translateY(12px) scale(0.98); opacity:0; transition: all .6s cubic-bezier(.2,.9,.2,1); }
        .hero-content h1{ font-family:'Playfair Display', serif; font-size:clamp(2rem,4vw,3.4rem); margin:0; color:#111; letter-spacing:.02em; text-shadow: 0 8px 24px rgba(0,0,0,0.04); font-weight:700; }
        .hero-content .sub{ margin-top:.5rem; color:rgba(16,16,16,0.68); font-size:1.05rem; letter-spacing:.01em; }
        .hero-divider{ width:60px; height:3px; background:linear-gradient(90deg,#f0a99b,#e8b1a4); border-radius:3px; margin-top:.8rem; opacity:0; transform:scaleX(0); transition: all .6s cubic-bezier(.2,.9,.2,1) .3s; }
        .hero-animate .hero-card{ transform: translateY(0) scale(1); opacity:1; }
        .hero-animate .hero-content h1{ animation: titleFade .9s cubic-bezier(.2,.9,.2,1) .1s both; }
        .hero-animate .hero-content .sub{ animation: subFade .9s cubic-bezier(.2,.9,.2,1) .22s both; }
        .hero-animate .hero-divider{ opacity:1; transform:scaleX(1); }
        @keyframes titleFade{ from{ opacity:0; transform:translateY(12px) } to{ opacity:1; transform:none } }
        @keyframes subFade{ from{ opacity:0; transform:translateY(8px) } to{ opacity:1; transform:none } }  /* filter underline animation */
  .filter-buttons{ position:relative; }
  .filter-buttons::after{ content:''; position:absolute; left:50%; transform:translateX(-50%); bottom:-8px; width:0; height:3px; background:linear-gradient(90deg,#f0a99b,#e8b1a4); border-radius:3px; transition: width .48s cubic-bezier(.2,.9,.2,1), left .48s cubic-bezier(.2,.9,.2,1); }
  .filter-buttons[data-active="true"]::after{ width:240px; }

        .container{ max-width:1100px; margin:0 auto; padding:1rem; }

        /* FILTERS */
        .gallery-filters{ padding:1.2rem 0 0.6rem; background:linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.96)); border-top:1px solid rgba(16,16,16,0.02); position:relative; z-index:10; }
        .filter-buttons{ display:flex; gap:.6rem; flex-wrap:wrap; justify-content:center; align-items:center; padding:1rem 0; }
        .filter-btn{ background:transparent; border:1px solid rgba(16,16,16,0.06); padding:.56rem .9rem; border-radius:999px; cursor:pointer; transition: all .32s cubic-bezier(.2,.9,.2,1); font-weight:600; color:#333; background-clip:padding-box; min-width:92px; text-align:center; position:relative; overflow:hidden; }
        .filter-btn::before{ content:''; position:absolute; inset:0; background:linear-gradient(90deg, transparent, rgba(240,169,155,0.1), transparent); transform:translateX(-100%); transition: transform .5s ease; }
        .filter-btn:hover{ transform:translateY(-3px); box-shadow:0 10px 30px rgba(15,15,15,0.06); }
        .filter-btn:hover::before{ transform:translateX(100%); }
        .filter-btn.active{ background:#fff; border-color:#f0a99b; box-shadow: 0 12px 40px rgba(240,169,155,0.1); color:#b43f2a; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse{ 0%, 100%{ transform:scale(1) } 50%{ transform:scale(1.02) } }        /* GRID */
        .gallery-grid{ display:grid; grid-template-columns: repeat(4, 1fr); gap:1.25rem; align-items:start; margin-top:1.2rem; padding-bottom:1.2rem; }
        @media (max-width:1000px){ .gallery-grid{ grid-template-columns: repeat(3,1fr); } }
        @media (max-width:720px){ .gallery-grid{ grid-template-columns: repeat(2,1fr); } }
        @media (max-width:420px){ .gallery-grid{ grid-template-columns: 1fr; } }

        .gallery-item{ position:relative; overflow:hidden; border-radius:22px; background:var(--card); box-shadow:var(--shadow); cursor:zoom-in; min-height:200px; transform:translateY(18px) scale(0.98); opacity:0; transition: all .5s cubic-bezier(.2,.9,.2,1); transform-style:preserve-3d; }
        .gallery-item::before{ content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(240,169,155,0.15) 100%); opacity:0; transition: opacity .4s ease; pointer-events:none; z-index:2; }
        .gallery-item::after{ content:''; position:absolute; inset:-2px; background:linear-gradient(45deg, transparent, rgba(240,169,155,0.3), transparent); opacity:0; transition: all .6s ease; border-radius:22px; pointer-events:none; z-index:1; animation: shimmer 3s linear infinite; animation-play-state:paused; }
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
        .meta .tag{ background:rgba(255,255,255,0.18); padding:.3rem .65rem; border-radius:999px; font-size:.8rem; text-transform:capitalize; color:#fff; backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.15); transition: all .3s ease; }
        .gallery-item:hover .meta .tag{ background:rgba(240,169,155,0.25); border-color:rgba(240,169,155,0.4); transform:scale(1.05); }
        
        /* LIGHTBOX */
        .lightbox{ position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(6,6,6,0.85); z-index:120; padding:2rem; animation: fadeIn .28s ease both; }
        @keyframes fadeIn{ from{ opacity:0 } to{ opacity:1 } }
        .lightbox-content{ position:relative; width:100%; max-width:1100px; max-height:92vh; display:flex; align-items:center; justify-content:center; gap:1rem; padding:1rem; }
        .lightbox-image-wrap{ flex:1 1 auto; display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .lightbox-image{ width:100%; height:auto; max-height:82vh; object-fit:contain; border-radius:14px; box-shadow:0 30px 90px rgba(0,0,0,0.7); animation: zoomIn .32s cubic-bezier(.2,.9,.2,1) both; }
        @keyframes zoomIn{ from{ transform:scale(0.96); opacity:0 } to{ transform:scale(1); opacity:1 } }
        .lightbox-caption{ margin-top:.8rem; color:#fff; opacity:.95; font-size:1rem; text-shadow:0 2px 8px rgba(0,0,0,0.3); font-weight:500; }
        .lightbox-close, .lightbox-prev, .lightbox-next{ position:absolute; background:rgba(255,255,255,0.98); border-radius:999px; border:none; width:50px; height:50px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 12px 36px rgba(10,10,10,0.15); transition: all .28s ease; font-size:24px; color:#333; }
        .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover{ background:#fff; transform:scale(1.08); box-shadow:0 14px 40px rgba(10,10,10,0.2); }
        .lightbox-close{ top:16px; right:16px; width:auto; height:auto; border-radius:12px; font-size:20px; padding:.5rem .7rem; }
        .lightbox-prev{ left:12px; top:50%; transform:translateY(-50%); }
        .lightbox-prev:hover{ transform:translateY(-50%) scale(1.08); }
        .lightbox-next{ right:12px; top:50%; transform:translateY(-50%); }
        .lightbox-next:hover{ transform:translateY(-50%) scale(1.08); }

        /* CTA */
        .gallery-cta{ padding:3.5rem 0 6rem; text-align:center; background:linear-gradient(180deg, rgba(255,250,248,0.5), rgba(255,255,255,0.8)); }
        .cta-content{ max-width:720px; margin:0 auto; }
        .cta-content h2{ font-family:'Playfair Display', serif; font-size:2.2rem; margin-bottom:.6rem; color:#222; font-weight:700; letter-spacing:.01em; }
        .cta-content p{ color:rgba(16,16,16,0.7); font-size:1.05rem; line-height:1.6; margin-bottom:1.4rem; }
        .cta-buttons{ display:inline-flex; gap:.7rem; margin-top:1rem; flex-wrap:wrap; justify-content:center; }
        .btn{ padding:.7rem 1.3rem; border-radius:12px; text-decoration:none; display:inline-block; font-weight:600; transition: all .32s cubic-bezier(.2,.9,.2,1); }
        .btn-primary{ background:#d97f6b; color:#fff; box-shadow:0 12px 40px rgba(217,127,107,0.16); }
        .btn-primary:hover{ background:#c76d5a; transform:translateY(-2px); box-shadow:0 16px 50px rgba(217,127,107,0.24); }
        .btn-outline{ border:2px solid rgba(16,16,16,0.08); background:transparent; color:#333; }
        .btn-outline:hover{ border-color:#f0a99b; background:rgba(240,169,155,0.06); transform:translateY(-2px); }        /* Filtering state */
        .is-filtering .gallery-item{ opacity:.28; transform:scale(.995); }
      `}</style>
      {/* HERO */}
      <section className={`page-hero ${heroAnimated ? 'hero-animate' : ''}`}>
        <div className="hero-overlay">
          <div className="hero-content hero-card">
            <h1>Our Gallery</h1>
            <p className="sub">Capturing love stories through timeless, romantic imagery</p>
            <div className="hero-divider"></div>
          </div>
        </div>
        <img ref={heroImageRef} src="/images/weddings/467502583_943824090943065_7221224242965653699_n.jpg" alt="Wedding Gallery" className="hero-image" />
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