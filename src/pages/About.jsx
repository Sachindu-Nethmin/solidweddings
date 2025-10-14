import React, { useEffect, useRef, useState } from 'react';

const About = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
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

        /* Philosophy Section */
        .philosophy {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8f6f4 0%, #fdfcfb 100%);
          position: relative;
          z-index: 5;
        }

        .philosophy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .philosophy-item {
          background: var(--card);
          border-radius: var(--radius);
          padding: 40px 30px;
          text-align: center;
          box-shadow: var(--shadow);
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        .philosophy-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 70px rgba(45, 45, 45, 0.12);
        }

        .philosophy-item .icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light));
          border-radius: 50%;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #fff;
        }

        .philosophy-item h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .philosophy-item p {
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* Experience Section */
        .experience {
          padding: 80px 0;
          position: relative;
          z-index: 5;
        }

        .experience-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .experience-image {
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .exp-image {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        .experience-image:hover .exp-image {
          transform: scale(1.05);
        }

        .experience-text h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 30px;
          color: var(--text-primary);
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0 0 40px;
        }

        .benefits-list li {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 0;
          color: var(--text-primary);
          font-size: 1.05rem;
        }

        .benefits-list i {
          color: var(--accent-gold);
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        /* About CTA Section */
        .about-cta {
          background: linear-gradient(135deg, var(--accent-gold) 0%, #a88a4f 100%);
          color: #fff;
          text-align: center;
          padding: 80px 0;
          position: relative;
          overflow: hidden;
          z-index: 10;
        }
        .about-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/images/weddings/467711436_943824007609740_2453538354038684178_n.jpg') center/cover;
          opacity: 0.1;
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 24px;
          color: #fff;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 40px;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
        }

        .btn-primary {
          background: var(--accent-gold);
          color: #fff;
          border: 2px solid var(--accent-gold);
          box-shadow: 0 12px 40px rgba(192, 160, 98, 0.3);
        }

        .btn-primary:hover {
          background: #a88a4f;
          border-color: #a88a4f;
          transform: translateY(-2px);
          box-shadow: 0 16px 50px rgba(192, 160, 98, 0.4);
        }

        .btn-outline {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        /* Our Story Section */
        .section p {
          color: var(--text-muted);
          line-height: 1.8;
          font-size: 1.1rem;
          margin-bottom: 20px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .philosophy-grid {
            grid-template-columns: 1fr;
          }
          .experience-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          .btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
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
              <a href="/contact" className="btn btn-outline">Get in Touch</a>
              <a href="/gallery" className="btn btn-outline">View Our Work</a>
            </div>
          </div>
        </div>
      </section>
    </div >
  );
};

export default About;