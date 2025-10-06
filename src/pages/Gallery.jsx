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
          src="/images/weddings/467502583_943824090943065_7221224242965653699_n.jpg" 
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