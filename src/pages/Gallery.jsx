import React, { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiCamera } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = [
    { id: 'all', name: '✨ All Photos', icon: '📸' },
    { id: 'ceremony', name: 'Ceremony', icon: '💒' },
    { id: 'reception', name: 'Reception', icon: '🎉' },
    { id: 'portraits', name: 'Portraits', icon: '👰' },
    { id: 'prewedding', name: 'Pre-Wedding', icon: '💑' }
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

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  const openLightbox = (image) => {
    setLightboxImage(image);
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImage) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, filteredImages]);

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <motion.section 
        className="page-hero gallery-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-overlay">
          <motion.div 
            className="hero-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1>✨ Our Wedding Gallery</h1>
            <p>Capturing Love Stories, One Frame at a Time</p>
            <div className="hero-stats">
              <div className="stat-item">
                <FiCamera size={24} />
                <span>{galleryImages.length}+ Photos</span>
              </div>
              <div className="stat-item">
                <span>❤️</span>
                <span>Memories Forever</span>
              </div>
            </div>
          </motion.div>
        </div>
        <img 
          src="/images/weddings/467502583_943824090943065_7221224242965653699_n.jpg" 
          alt="Wedding Gallery"
          className="hero-image"
        />
      </motion.section>

      {/* Gallery Filters */}
      <section className="gallery-filters modern-filters">
        <div className="container">
          <motion.h2 
            className="filter-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Browse Our Collection
          </motion.h2>
          <div className="filter-buttons">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`filter-btn modern-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="filter-icon">{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section modern-gallery">
        <div className="container">
          <motion.div 
            className="gallery-grid masonry-grid"
            layout
          >
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div 
                  key={image.id} 
                  className="gallery-item modern-gallery-item"
                  onClick={() => openLightbox(image)}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="image-wrapper">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="gallery-overlay modern-overlay">
                      <div className="overlay-content">
                        <FiCamera size={30} />
                        <p className="image-title">{image.alt}</p>
                        <span className="view-text">Click to view</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            className="lightbox modern-lightbox"
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <button className="lightbox-close modern-lightbox-btn" onClick={closeLightbox}>
                <FiX size={24} />
              </button>
              <button className="lightbox-prev modern-lightbox-btn" onClick={prevImage}>
                <FiChevronLeft size={28} />
              </button>
              <div className="lightbox-image-wrapper">
                <img 
                  src={lightboxImage.src} 
                  alt={lightboxImage.alt}
                  className="lightbox-image"
                />
                <div className="lightbox-caption">
                  <p>{lightboxImage.alt}</p>
                </div>
              </div>
              <button className="lightbox-next modern-lightbox-btn" onClick={nextImage}>
                <FiChevronRight size={28} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <motion.section 
        className="gallery-cta modern-cta"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="cta-content">
            <h2>💕 Love What You See?</h2>
            <p>
              These are just a few examples of our work. Let's create beautiful 
              memories for your special day too.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">📞 Book Your Session</a>
              <a href="/services" className="btn btn-outline">📦 View Packages</a>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Gallery;