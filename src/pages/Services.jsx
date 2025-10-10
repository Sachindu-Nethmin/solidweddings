import React, { useEffect, useRef, useState } from 'react';

const Services = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
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

  // Scroll tracking for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const parallaxOffset = scrollY * 0.3;

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
          transition: opacity 3s ease-in-out, transform 3s ease-in-out;
          transform: translateY(${parallaxOffset}px) scale(1.05);
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

        /* ...existing styles for services content... */
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
              <a href="/contact" className="btn btn-primary">Get Custom Quote</a>
              <a href="tel:+94712710881" className="btn btn-secondary">
                <i className="fas fa-phone"></i> Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;