import React, { useEffect, useRef, useState } from 'react';

const Services = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);

  const heroImages = [
    '/images/weddings/467459120_943824510943023_6632681943136575200_n.jpg',
    '/images/weddings/467525385_943824337609707_4503835412837400410_n.jpg',
    '/images/weddings/467672116_943824590943015_1177962738152061151_n.jpg'
  ];

  // Component mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
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

    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`services-page ${isLoaded ? 'loaded' : ''}`}>
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

        .services-page {
          font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
          color: var(--text-primary);
          background: var(--bg);
          min-height: 100vh;
          padding-top: var(--header-offset);
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .services-page.loaded { opacity: 1; }

        .services-page::before {
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
          height: 70vh;
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
          background: linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%);
          z-index: 3;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 24px;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 8vw, 6rem);
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
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-weight: 400;
          margin: 0 0 32px;
          letter-spacing: 0.02em;
          line-height: 1.6;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          animation: subtitleFadeIn 1.2s ease 0.7s both;
        }
        @keyframes subtitleFadeIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }

        /* Common styles */
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

        /* Services Grid Section - "What We Offer" */
        .services-grid-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #f8f6f4 0%, #fdfcfb 100%);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .service-card {
          background: var(--card);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 60px rgba(45, 45, 45, 0.12);
        }

        .service-image {
          width: 100%;
          height: 300px;
          overflow: hidden;
          position: relative;
        }
        .service-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .service-card:hover .service-image img {
          transform: scale(1.1);
        }

        .service-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .service-content h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 12px 0;
        }

        .service-content p {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.7;
          margin: 0 0 20px 0;
        }

        .service-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .service-features li {
          color: var(--text-muted);
          font-size: 0.95rem;
          padding-left: 28px;
          position: relative;
          line-height: 1.5;
        }
        .service-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent-gold);
          font-weight: 700;
          font-size: 1.1rem;
        }

        /* Packages Section - Keep existing styles */
        .packages {
          padding: 100px 0;
          background: var(--bg);
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .package-card {
          background: var(--card);
          border-radius: var(--radius);
          padding: 48px 36px;
          box-shadow: var(--shadow);
          transition: all 0.4s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .package-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 60px rgba(45, 45, 45, 0.15);
        }
        .package-card.featured {
          background: var(--card);
          color: var(--text-primary);
          transform: scale(1.05);
          border: 3px solid #ff6b6b;
          box-shadow: 0 20px 60px rgba(255, 107, 107, 0.2);
        }
        .package-card.featured:hover {
          transform: scale(1.05) translateY(-8px);
          box-shadow: 0 24px 70px rgba(255, 107, 107, 0.25);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .package-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 16px 0;
        }
        .package-card.featured h3 {
          color: var(--text-primary);
        }

        .package-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-gold);
          margin-bottom: 32px;
        }
        .package-card.featured .package-price {
          color: #ff6b6b;
          font-size: 1.75rem;
        }

        .package-features {
          list-style: none;
          padding: 0;
          margin: 0 0 40px 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .package-features li {
          color: var(--text-muted);
          font-size: 0.95rem;
          padding: 12px 0;
          border-bottom: 1px solid rgba(45, 45, 45, 0.08);
          text-align: center;
        }
        .package-card.featured .package-features li {
          color: var(--text-muted);
          border-bottom-color: rgba(45, 45, 45, 0.08);
        }
        .package-features li:last-child {
          border-bottom: none;
        }

        /* CTA Section */
        .services-cta {
          padding: 100px 0;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #a88a4f 100%);
          position: relative;
          overflow: hidden;
          z-index: 10;
        }
        .services-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/images/weddings/467459120_943824510943023_6632681943136575200_n.jpg') center/cover;
          opacity: 0.1;
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          color: white;
          margin: 0 0 24px 0;
          line-height: 1.2;
        }

        .cta-content p {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.25rem;
          line-height: 1.7;
          margin: 0 0 48px 0;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 50px;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.2, 1);
          cursor: pointer;
        }

        /* CTA Section Buttons - Glass Morphism Style */
        .services-cta .btn {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        .services-cta .btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        /* Package Card Buttons */
        .btn-outline {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          backdrop-filter: blur(10px);
          border: 2px solid var(--accent-gold);
        }
        .btn-outline:hover {
          background: var(--accent-gold);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(192, 160, 98, 0.3);
        }
        .btn-primary {
          background: white;
          color: var(--accent-gold);
          border: 2px solid white;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.25);
        }
        .package-card.featured .btn-primary {
          background: white;
          color: var(--accent-gold);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .services-grid,
          .packages-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .package-card.featured {
            transform: scale(1);
          }
          .package-card.featured:hover {
            transform: translateY(-8px);
          }
          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .service-content {
            padding: 24px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`hero-bg-image ${index === currentHeroImage ? 'active' : 'inactive'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">Our Services</h1>
          <p className="hero-subtitle">
            Comprehensive photography packages tailored to capture every precious moment of your special day
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <h2 className="section-title scroll-animate">What We Offer</h2>
          
          <div className="services-grid">
            {/* Wedding Photography */}
            <div className="service-card">
              <div className="service-image">
                <img 
                  src="/images/weddings/467833684_943824270943047_5484742608995516360_n.jpg" 
                  alt="Wedding Photography"
                />
              </div>
              <div className="service-content">
                <h3>Wedding Day Photography</h3>
                <p>
                  Complete coverage of your wedding day from preparation to reception. 
                  We capture every precious moment, emotion, and detail to tell your 
                  complete love story.
                </p>
                <ul className="service-features">
                  <li>8-12 hours of coverage</li>
                  <li>Professional editing</li>
                  <li>High-resolution digital gallery</li>
                  <li>Online gallery for sharing</li>
                  <li>Print release included</li>
                </ul>
              </div>
            </div>

            {/* Pre-Wedding Shoots */}
            <div className="service-card">
              <div className="service-image">
                <img 
                  src="/images/weddings/467581955_943824264276381_72587053085497663_n.jpg" 
                  alt="Pre-Wedding Photography"
                />
              </div>
              <div className="service-content">
                <h3>Pre-Wedding Photography</h3>
                <p>
                  Romantic couple sessions in beautiful locations. Perfect for 
                  engagement announcements, save-the-dates, or simply celebrating 
                  your love before the big day.
                </p>
                <ul className="service-features">
                  <li>2-3 hours photo session</li>
                  <li>Location scouting</li>
                  <li>Outfit change options</li>
                  <li>Professional retouching</li>
                  <li>High-quality prints available</li>
                </ul>
              </div>
            </div>

            {/* Event Photography */}
            <div className="service-card">
              <div className="service-image">
                <img 
                  src="/images/weddings/467615027_943824340943040_3427541276125358098_n.jpg" 
                  alt="Event Photography"
                />
              </div>
              <div className="service-content">
                <h3>Event Photography</h3>
                <p>
                  Professional coverage for engagement parties, bridal showers, 
                  rehearsal dinners, and other wedding-related events. Capture 
                  all the celebrations leading up to your big day.
                </p>
                <ul className="service-features">
                  <li>Flexible coverage hours</li>
                  <li>Candid and posed shots</li>
                  <li>Quick turnaround time</li>
                  <li>Digital delivery</li>
                  <li>Social media ready images</li>
                </ul>
              </div>
            </div>

            {/* Portrait Sessions */}
            <div className="service-card">
              <div className="service-image">
                <img 
                  src="/images/weddings/467711436_943824007609740_2453538354038684178_n.jpg" 
                  alt="Portrait Photography"
                />
              </div>
              <div className="service-content">
                <h3>Bridal Portraits</h3>
                <p>
                  Elegant bridal portrait sessions to capture the bride's beauty 
                  and grace. Perfect for creating stunning images for display 
                  at the wedding or as keepsakes.
                </p>
                <ul className="service-features">
                  <li>Studio or outdoor options</li>
                  <li>Professional makeup consultation</li>
                  <li>Multiple outfit options</li>
                  <li>Artistic editing</li>
                  <li>Large format prints available</li>
                </ul>
              </div>
            </div>

            {/* Family Photography */}
            <div className="service-card">
              <div className="service-image">
                <img 
                  src="/images/weddings/467717505_943824147609726_5116480860040812036_n.jpg" 
                  alt="Family Photography"
                />
              </div>
              <div className="service-content">
                <h3>Family Photography</h3>
                <p>
                  Capture beautiful family moments during wedding celebrations. 
                  Perfect for creating lasting memories with extended family 
                  and loved ones who gathered for your special day.
                </p>
                <ul className="service-features">
                  <li>Group and individual shots</li>
                  <li>Multi-generational photos</li>
                  <li>Natural poses and interactions</li>
                  <li>Quick editing and delivery</li>
                  <li>Group order options</li>
                </ul>
              </div>
            </div>

            {/* Album Creation */}
            <div className="service-card">
              <div className="service-image">
                <img 
                  src="/images/weddings/467968877_943824064276401_491288167559794518_n.jpg" 
                  alt="Wedding Albums"
                />
              </div>
              <div className="service-content">
                <h3>Wedding Albums</h3>
                <p>
                  Beautifully designed wedding albums to preserve your memories 
                  in a tangible, heirloom-quality format. Custom layouts that 
                  tell your wedding story perfectly.
                </p>
                <ul className="service-features">
                  <li>Premium quality materials</li>
                  <li>Custom design layouts</li>
                  <li>Various sizes available</li>
                  <li>Acid-free, archival quality</li>
                  <li>Additional copies available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages">
        <div className="container">
          <h2 className="section-title">Wedding Packages</h2>
          <div className="packages-grid">
            <div className="package-card">
              <h3>Essential Package</h3>
              <div className="package-price">Starting from LKR 75,000</div>
              <ul className="package-features">
                <li>6 hours wedding day coverage</li>
                <li>200+ edited high-resolution photos</li>
                <li>Online gallery</li>
                <li>Print release</li>
                <li>USB delivery</li>
              </ul>
              <a href="/contact" className="btn btn-outline">Get Quote</a>
            </div>

            <div className="package-card featured">
              <div className="popular-badge">Most Popular</div>
              <h3>Premium Package</h3>
              <div className="package-price">Starting from LKR 125,000</div>
              <ul className="package-features">
                <li>10 hours wedding day coverage</li>
                <li>400+ edited high-resolution photos</li>
                <li>Pre-wedding photo session</li>
                <li>Online gallery with sharing</li>
                <li>50 printed photos</li>
                <li>USB + Cloud delivery</li>
              </ul>
              <a href="/contact" className="btn btn-primary">Get Quote</a>
            </div>

            <div className="package-card">
              <h3>Luxury Package</h3>
              <div className="package-price">Starting from LKR 200,000</div>
              <ul className="package-features">
                <li>Full day wedding coverage</li>
                <li>600+ edited high-resolution photos</li>
                <li>Pre-wedding session</li>
                <li>Bridal portrait session</li>
                <li>Custom wedding album</li>
                <li>All digital files</li>
                <li>Second photographer</li>
              </ul>
              <a href="/contact" className="btn btn-outline">Get Quote</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Book Your Wedding Photography?</h2>
            <p>
              Let's discuss your needs and create a custom package that perfectly 
              captures your special day within your budget.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn">Get In Touch</a>
              <a href="/services" className="btn">View Packages</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;