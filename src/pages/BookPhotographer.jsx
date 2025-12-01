import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookPhotographer = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
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

    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const photographers = [
    {
      id: 1,
      name: 'Solid Weddings Team',
      specialty: 'Complete Wedding Coverage',
      image: '/images/weddings/467502583_943824090943065_7221224242965653699_n.jpg',
      experience: '10+ Years',
      packages: ['Essential', 'Premium', 'Luxury'],
      description: 'Professional team specializing in capturing every precious moment of your special day with artistic excellence.',
      rating: 5.0,
      reviews: 150
    },
    {
      id: 2,
      name: 'Lead Photographer',
      specialty: 'Candid & Artistic Photography',
      image: '/images/weddings/453353797_868177951841013_4737084022978926838_n.jpg',
      experience: '8+ Years',
      packages: ['Premium', 'Luxury', 'Custom'],
      description: 'Expert in capturing authentic emotions and creating timeless memories through artistic wedding photography.',
      rating: 4.9,
      reviews: 120
    },
    {
      id: 3,
      name: 'Cinematography Specialist',
      specialty: 'Wedding Films & Videography',
      image: '/images/weddings/467459120_943824510943023_6632681943136575200_n.jpg',
      experience: '7+ Years',
      packages: ['Premium', 'Luxury'],
      description: 'Creating cinematic wedding films that tell your unique love story with stunning visuals and emotions.',
      rating: 4.9,
      reviews: 95
    }
  ];

  const handleSelectPhotographer = (photographer) => {
    setSelectedPhotographer(photographer);
    // Navigate to contact page with photographer info
    navigate('/contact', { state: { selectedPhotographer: photographer } });
  };

  return (
    <div className={`book-photographer-page ${isLoaded ? 'loaded' : ''}`}>
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
          --radius: 20px;
          --header-offset: 72px;
        }

        .book-photographer-page {
          font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
          color: var(--text-primary);
          background: var(--bg);
          min-height: 100vh;
          padding-top: var(--header-offset);
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .book-photographer-page.loaded { opacity: 1; }

        .book-photographer-page::before {
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

        /* Header Section */
        .booking-header {
          text-align: center;
          padding: 80px 24px 60px;
          position: relative;
          z-index: 5;
        }

        .booking-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          margin: 0 0 20px;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .booking-header p {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--text-muted);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Photographers Grid */
        .photographers-section {
          padding: 40px 0 100px;
          position: relative;
          z-index: 5;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .photographers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          margin-top: 40px;
        }

        .photographer-card {
          background: var(--card);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .photographer-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 70px rgba(45, 45, 45, 0.12);
        }

        .photographer-image {
          width: 100%;
          height: 320px;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .photographer-card:hover .photographer-image {
          transform: scale(1.05);
        }

        .photographer-content {
          padding: 30px;
        }

        .photographer-header {
          margin-bottom: 15px;
        }

        .photographer-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--text-primary);
        }

        .photographer-specialty {
          color: var(--accent-gold);
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .photographer-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 15px 0;
        }

        .stars {
          color: #f5a623;
          font-size: 1rem;
        }

        .rating-text {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .photographer-description {
          color: var(--text-muted);
          line-height: 1.7;
          margin: 15px 0;
          font-size: 0.95rem;
        }

        .photographer-details {
          display: flex;
          gap: 15px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .detail-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(192, 160, 98, 0.1);
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .detail-badge i {
          color: var(--accent-gold);
        }

        .packages-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin: 15px 0;
        }

        .package-tag {
          padding: 6px 14px;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light));
          color: white;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .select-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light));
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }

        .select-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(192, 160, 98, 0.3);
        }

        .select-button i {
          font-size: 1rem;
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

        /* Info Section */
        .booking-info {
          background: var(--card);
          padding: 60px 24px;
          margin: 60px 0;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .booking-info h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          text-align: center;
          margin-bottom: 40px;
          color: var(--text-primary);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          max-width: 900px;
          margin: 0 auto;
        }

        .info-item {
          text-align: center;
        }

        .info-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 1.8rem;
        }

        .info-item h3 {
          font-size: 1.3rem;
          margin: 0 0 10px;
          color: var(--text-primary);
        }

        .info-item p {
          color: var(--text-muted);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .photographers-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .booking-header {
            padding: 60px 24px 40px;
          }

          .photographer-image {
            height: 280px;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="booking-header">
        <h1>Select Your Photographer</h1>
        <p>
          Choose the perfect photographer for your special day. Each member of our team 
          brings unique expertise and style to capture your wedding moments beautifully.
        </p>
      </div>

      {/* Photographers Grid */}
      <section className="photographers-section">
        <div className="container">
          <div className="photographers-grid">
            {photographers.map((photographer, index) => (
              <div 
                key={photographer.id} 
                className="photographer-card scroll-animate"
                onClick={() => handleSelectPhotographer(photographer)}
              >
                <img 
                  src={photographer.image} 
                  alt={photographer.name}
                  className="photographer-image"
                />
                <div className="photographer-content">
                  <div className="photographer-header">
                    <h3 className="photographer-name">{photographer.name}</h3>
                    <p className="photographer-specialty">{photographer.specialty}</p>
                  </div>

                  <div className="photographer-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                    <span className="rating-text">
                      {photographer.rating} ({photographer.reviews} reviews)
                    </span>
                  </div>

                  <p className="photographer-description">
                    {photographer.description}
                  </p>

                  <div className="photographer-details">
                    <div className="detail-badge">
                      <i className="fas fa-award"></i>
                      <span>{photographer.experience}</span>
                    </div>
                  </div>

                  <div className="packages-list">
                    {photographer.packages.map((pkg, idx) => (
                      <span key={idx} className="package-tag">{pkg}</span>
                    ))}
                  </div>

                  <button className="select-button">
                    <i className="fas fa-calendar-check"></i>
                    Book {photographer.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="booking-info scroll-animate">
            <h2>How It Works</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <h3>1. Select</h3>
                <p>Choose your preferred photographer based on their specialty and style</p>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>2. Consult</h3>
                <p>Discuss your vision, requirements, and get a personalized quote</p>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h3>3. Book</h3>
                <p>Confirm your booking and secure your date with us</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookPhotographer;
