import React, { useEffect, useRef, useState } from 'react';

const About = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  const heroImages = [
    '/images/weddings/467711436_943824007609740_2453538354038684178_n.jpg',
    '/images/weddings/467654997_943824067609734_1941169228740568755_n.jpg',
    '/images/weddings/467614283_943824474276360_1770150232184232428_n.jpg'
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
    <div className={`about-page ${isLoaded ? 'loaded' : ''}`}>
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

        .about-page {
          font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
          color: var(--text-primary);
          background: var(--bg);
          min-height: 100vh;
          padding-top: var(--header-offset);
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .about-page.loaded { opacity: 1; }

        .about-page::before {
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

        /* Rest of the styles same as Home.jsx */
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
      `}</style>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`hero-bg-image ${index === currentHeroImage ? 'active' : 'inactive'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">About Us</h1>
          <p className="hero-subtitle">
            Passionate photographers dedicated to capturing the beauty, emotion, and essence of your most treasured moments
          </p>
        </div>
      </section>

      {/* About Content Sections */}
      <section className="section">
        <div className="container">
          <div className="scroll-animate">
            <h2 className="section-title">Our Story</h2>
            <p>
              Welcome to Solid Weddings, where passion meets artistry in wedding photography. 
              We believe that every wedding is a unique story waiting to be told through 
              beautiful, timeless images.
            </p>
            <p>
              Our journey began with a simple love for capturing authentic moments and 
              genuine emotions. Over the years, we've had the privilege of documenting 
              hundreds of love stories, each one special and meaningful in its own way.
            </p>
            <p>
              What sets us apart is our commitment to understanding your vision and 
              translating it into stunning photographs that reflect your personality 
              and style. We don't just take pictures; we create memories that will 
              be treasured for generations.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy">
        <div className="container">
          <h2 className="section-title">Our Philosophy</h2>
          <div className="philosophy-grid">
            <div className="philosophy-item">
              <div className="icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Authentic Moments</h3>
              <p>
                We capture genuine emotions and candid moments that truly 
                represent your special day.
              </p>
            </div>
            <div className="philosophy-item">
              <div className="icon">
                <i className="fas fa-camera"></i>
              </div>
              <h3>Artistic Excellence</h3>
              <p>
                Our artistic approach ensures every photo is a work of art 
                that tells your unique story.
              </p>
            </div>
            <div className="philosophy-item">
              <div className="icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Personal Service</h3>
              <p>
                We work closely with each couple to understand their vision 
                and exceed their expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience">
        <div className="container">
          <div className="experience-content">
            <div className="experience-image">
              <img 
                src="/images/weddings/467870739_943824287609712_5253220292708146503_n.jpg" 
                alt="Photography Experience"
                className="exp-image"
              />
            </div>
            <div className="experience-text">
              <h2>Why Choose Solid Weddings?</h2>
              <ul className="benefits-list">
                <li>
                  <i className="fas fa-check"></i>
                  Years of experience in wedding photography
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Professional-grade equipment and techniques
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Personalized approach to every wedding
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Quick turnaround time for edited photos
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Comprehensive packages to suit every budget
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Professional post-processing and editing
                </li>
              </ul>
              <a href="/contact" className="btn btn-primary">Work With Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Let's Create Magic Together</h2>
            <p>
              Ready to discuss your wedding photography needs? We'd love to hear from you 
              and learn about your special day.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">Get in Touch</a>
              <a href="/gallery" className="btn btn-outline">View Our Work</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;