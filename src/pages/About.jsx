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

  // Component mount animations
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

        /* Philosophy Section Styles */
        .philosophy {
          position: relative;
          padding: 120px 0;
          background: linear-gradient(135deg, var(--bg) 0%, #f8f6f3 50%, var(--bg) 100%);
          overflow: hidden;
        }

        .philosophy-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(192, 160, 98, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(192, 160, 98, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(192, 160, 98, 0.02) 0%, transparent 60%);
          animation: philosophyBgFloat 30s ease-in-out infinite;
        }
        @keyframes philosophyBgFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(20px, -15px) rotate(1deg) scale(1.02); }
          66% { transform: translate(-15px, 10px) rotate(-0.5deg) scale(0.98); }
        }

        .philosophy-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 80px;
        }

        .philosophy-title {
          position: relative;
          margin-bottom: 24px;
        }
        .philosophy-title::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-gold-light));
          border-radius: 2px;
          animation: titleUnderline 1.5s ease 1s both;
        }
        @keyframes titleUnderline {
          from { width: 0; opacity: 0; }
          to { width: 80px; opacity: 1; }
        }

        .philosophy-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          color: var(--text-muted);
          line-height: 1.8;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .philosophy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .philosophy-item {
          opacity: 0;
          transform: translateY(60px) scale(0.95);
          transition: all 0.8s cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        .philosophy-item.animate-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .philosophy-item[data-delay="150"].animate-in { transition-delay: 0.15s; }
        .philosophy-item[data-delay="300"].animate-in { transition-delay: 0.3s; }
        .philosophy-item[data-delay="450"].animate-in { transition-delay: 0.45s; }
        .philosophy-item[data-delay="600"].animate-in { transition-delay: 0.6s; }
        .philosophy-item[data-delay="750"].animate-in { transition-delay: 0.75s; }

        .philosophy-card {
          position: relative;
          background: var(--card);
          border-radius: var(--radius);
          padding: 40px 32px;
          text-align: center;
          box-shadow: var(--shadow);
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
          border: 1px solid rgba(192, 160, 98, 0.1);
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .philosophy-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-gold-light));
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }
        .philosophy-card:hover::before {
          transform: scaleX(1);
        }
        .philosophy-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 60px rgba(45, 45, 45, 0.12);
          border-color: rgba(192, 160, 98, 0.2);
        }

        .philosophy-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .philosophy-icon {
          position: relative;
          z-index: 2;
          color: var(--accent-gold);
          transition: all 0.4s ease;
          animation: iconFloat 4s ease-in-out infinite;
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
        .philosophy-card:hover .philosophy-icon {
          color: var(--text-primary);
          transform: scale(1.1);
          animation-play-state: paused;
        }

        .philosophy-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(192, 160, 98, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s ease;
          animation: glowPulse 3s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
        .philosophy-card:hover .philosophy-glow {
          opacity: 1;
          animation-play-state: paused;
        }

        .philosophy-item-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .philosophy-item-text {
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 1rem;
          font-weight: 400;
          flex-grow: 1;
          margin-bottom: 20px;
        }

        .philosophy-decoration {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-gold-light), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .philosophy-card:hover .philosophy-decoration {
          opacity: 1;
        }

        .philosophy-quote {
          text-align: center;
          max-width: 700px;
          margin: 80px auto 0;
          padding: 40px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: var(--radius);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(192, 160, 98, 0.1);
          position: relative;
          overflow: hidden;
        }
        .philosophy-quote::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(192, 160, 98, 0.05) 0%, transparent 50%);
          animation: quoteShimmer 4s ease-in-out infinite;
        }
        @keyframes quoteShimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .philosophy-quote blockquote {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          font-style: italic;
          color: var(--text-primary);
          margin: 0 0 16px;
          line-height: 1.6;
          position: relative;
          z-index: 2;
        }
        .philosophy-quote blockquote::before {
          content: '"';
          font-size: 3rem;
          color: var(--accent-gold);
          position: absolute;
          top: -10px;
          left: -20px;
          font-family: serif;
        }

        .philosophy-quote cite {
          color: var(--text-muted);
          font-size: 1rem;
          font-weight: 500;
          position: relative;
          z-index: 2;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .philosophy {
            padding: 80px 0;
          }
          .philosophy-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .philosophy-card {
            padding: 32px 24px;
          }
          .philosophy-quote {
            margin: 60px auto 0;
            padding: 32px 24px;
          }
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
        <div className="philosophy-bg"></div>
        <div className="container">
          <div className="philosophy-header scroll-animate">
            <h2 className="section-title philosophy-title">Our Philosophy</h2>
            <p className="philosophy-subtitle">
              Every moment is precious. Our approach is rooted in capturing the authentic beauty 
              and genuine emotions that make your story uniquely yours.
            </p>
          </div>
          
          <div className="philosophy-grid">
            <div className="philosophy-item scroll-animate" data-delay="0">
              <div className="philosophy-card">
                <div className="philosophy-icon-wrapper">
                  <div className="philosophy-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="philosophy-glow"></div>
                </div>
                <h3 className="philosophy-item-title">Authentic Moments</h3>
                <p className="philosophy-item-text">
                  We believe in capturing raw, unfiltered emotions. Every laugh, 
                  tear, and tender glance tells your story in its most genuine form.
                </p>
                <div className="philosophy-decoration"></div>
              </div>
            </div>

            <div className="philosophy-item scroll-animate" data-delay="150">
              <div className="philosophy-card">
                <div className="philosophy-icon-wrapper">
                  <div className="philosophy-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="philosophy-glow"></div>
                </div>
                <h3 className="philosophy-item-title">Artistic Excellence</h3>
                <p className="philosophy-item-text">
                  Through masterful composition, lighting, and timing, we transform 
                  fleeting moments into timeless works of art that speak to the soul.
                </p>
                <div className="philosophy-decoration"></div>
              </div>
            </div>

            <div className="philosophy-item scroll-animate" data-delay="300">
              <div className="philosophy-card">
                <div className="philosophy-icon-wrapper">
                  <div className="philosophy-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="philosophy-glow"></div>
                </div>
                <h3 className="philosophy-item-title">Personal Connection</h3>
                <p className="philosophy-item-text">
                  We take time to understand your unique story, building trust 
                  and connection that allows us to capture your most intimate moments.
                </p>
                <div className="philosophy-decoration"></div>
              </div>
            </div>

            <div className="philosophy-item scroll-animate" data-delay="450">
              <div className="philosophy-card">
                <div className="philosophy-icon-wrapper">
                  <div className="philosophy-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="philosophy-glow"></div>
                </div>
                <h3 className="philosophy-item-title">Passionate Craft</h3>
                <p className="philosophy-item-text">
                  Photography isn't just our profession—it's our passion. We pour 
                  our hearts into every shot, ensuring each image resonates with life.
                </p>
                <div className="philosophy-decoration"></div>
              </div>
            </div>

            <div className="philosophy-item scroll-animate" data-delay="600">
              <div className="philosophy-card">
                <div className="philosophy-icon-wrapper">
                  <div className="philosophy-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="philosophy-glow"></div>
                </div>
                <h3 className="philosophy-item-title">Lasting Legacy</h3>
                <p className="philosophy-item-text">
                  We create heirloom-quality images that will be treasured for 
                  generations, preserving your love story for years to come.
                </p>
                <div className="philosophy-decoration"></div>
              </div>
            </div>

            <div className="philosophy-item scroll-animate" data-delay="750">
              <div className="philosophy-card">
                <div className="philosophy-icon-wrapper">
                  <div className="philosophy-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="philosophy-glow"></div>
                </div>
                <h3 className="philosophy-item-title">Seamless Experience</h3>
                <p className="philosophy-item-text">
                  From initial consultation to final delivery, we ensure a smooth, 
                  stress-free experience that lets you focus on what matters most.
                </p>
                <div className="philosophy-decoration"></div>
              </div>
            </div>
          </div>

          <div className="philosophy-quote scroll-animate">
            <blockquote>
              "Photography is not about the camera, it's about the heart behind it. 
              We don't just document your day—we preserve the soul of your love story."
            </blockquote>
            <cite>— The Solid Weddings Team</cite>
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
    </div >
  );
};

export default About;