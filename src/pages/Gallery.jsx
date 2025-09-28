import React, { useState } from 'react';

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
      src: '/images/453353797_868177951841013_4737084022978926838_n (1).jpg',
      alt: 'Wedding Ceremony',
      category: 'ceremony'
    },
    {
      id: 2,
      src: '/images/1 (1).png',
      alt: 'Bridal Portrait',
      category: 'portraits'
    },
    {
      id: 3,
      src: '/images/2 (1).png',
      alt: 'Wedding Reception',
      category: 'reception'
    },
    {
      id: 4,
      src: '/images/3 (1).png',
      alt: 'Pre-Wedding Shoot',
      category: 'prewedding'
    },
    {
      id: 5,
      src: '/images/220-Cam-1-1191.png',
      alt: 'Wedding Photography',
      category: 'ceremony'
    },
    {
      id: 6,
      src: '/images/220-Cam-1-1191-1.png',
      alt: 'Wedding Moments',
      category: 'reception'
    },
    {
      id: 7,
      src: '/images/1-1 (1).png',
      alt: 'Event Photography',
      category: 'reception'
    },
    {
      id: 8,
      src: '/images/1-2.png',
      alt: 'Family Portrait',
      category: 'portraits'
    },
    {
      id: 9,
      src: '/images/1-3.png',
      alt: 'Wedding Album',
      category: 'portraits'
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

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Our Gallery</h1>
            <p>Beautiful Moments Captured Forever</p>
          </div>
        </div>
        <img 
          src="/images/453353797_868177951841013_4737084022978926838_n (1).jpg" 
          alt="Wedding Gallery"
          className="hero-image"
        />
      </section>

      {/* Gallery Filters */}
      <section className="gallery-filters">
        <div className="container">
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-grid">
            {filteredImages.map(image => (
              <div 
                key={image.id} 
                className="gallery-item"
                onClick={() => openLightbox(image)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className="fas fa-times"></i>
            </button>
            <button className="lightbox-prev" onClick={prevImage}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <img 
              src={lightboxImage.src} 
              alt={lightboxImage.alt}
              className="lightbox-image"
            />
            <button className="lightbox-next" onClick={nextImage}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="gallery-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Love What You See?</h2>
            <p>
              These are just a few examples of our work. Let's create beautiful 
              memories for your special day too.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">Book Your Session</a>
              <a href="/services" className="btn btn-outline">View Packages</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;