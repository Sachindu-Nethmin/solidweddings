import React, { useEffect, useRef, useState } from 'react';

const Contact = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);

  const heroImages = [
    '/solidweddings/images/weddings/467696682_943824070943067_9155044915667421983_n.jpg',
    '/solidweddings/images/weddings/467643997_943824010943073_1011805423029436531_n.jpg',
    '/solidweddings/images/weddings/467717505_943824147609726_5116480860040812036_n.jpg'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    venue: '',
    package: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    message: '',
    type: ''
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission to here
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will get back to you soon.');
    
    // Set loading states
    setFormStatus({
      isSubmitting: true,
      message: 'Sending your inquiry...',
      type: 'info'
    });

    try {
      // EmailJS configuration
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_solid_weddings';
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_contact_form';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

      // Prepare email template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        wedding_date: formData.weddingDate,
        venue: formData.venue,
        package: formData.package,
        message: formData.message,
        to_email: 'snapssolid@gmail.com', // Your business email
        reply_to: formData.email
      };

      // Send email using EmailJS
      const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
      
      console.log('Email sent successfully:', response);
      console.log('Form submitted:', formData);

      // Success state
      setFormStatus({
        isSubmitting: false,
        message: 'Thank you for your inquiry! We will get back to you within 24 hours.',
        type: 'success'
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        weddingDate: '',
        venue: '',
        package: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ isSubmitting: false, message: '', type: '' });
      }, 5000);

    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Error state
      setFormStatus({
        isSubmitting: false,
        message: 'Sorry, there was an error sending your message. Please try calling us directly.',
        type: 'error'
      });

      // Clear error message after 7 seconds
      setTimeout(() => {
        setFormStatus({ isSubmitting: false, message: '', type: '' });
      }, 7000);
    }
  };

  return (
    <div className={`contact-page ${isLoaded ? 'loaded' : ''}`}>
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

        .contact-page {
          font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
          color: var(--text-primary);
          background: var(--bg);
          min-height: 100vh;
          padding-top: var(--header-offset);
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .contact-page.loaded { opacity: 1; }

        .contact-page::before {
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
          height: 80vh;
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-top: calc(var(--header-offset) * -1); /* Pull hero up by 72px */
          padding-top: var(--header-offset);           /* Add 72px padding inside */
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
          background: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%);
          z-index: 3;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.2rem, 7vw, 5.5rem);
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
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          font-weight: 400;
          margin: 0;
          letter-spacing: 0.02em;
          line-height: 1.6;
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

        /* ...existing contact styles... */
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
          <h1 className="hero-title">Get In Touch</h1>
          <p className="hero-subtitle">
            Ready to capture your special moments? Let's discuss your vision and create something beautiful together.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Get Your Free Quote</h2>
              <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="weddingDate">Wedding Date</label>
                    <input
                      type="date"
                      id="weddingDate"
                      name="weddingDate"
                      value={formData.weddingDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="venue">Wedding Venue</label>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="e.g., Colombo, Kandy, Galle"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="package">Package Interest</label>
                    <select
                      id="package"
                      name="package"
                      value={formData.package}
                      onChange={handleChange}
                    >
                      <option value="">Select a Package</option>
                      <option value="essential">Essential Package</option>
                      <option value="premium">Premium Package</option>
                      <option value="luxury">Luxury Package</option>
                      <option value="custom">Custom Package</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tell us about your wedding *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us about your vision, special requirements, or any questions you have..."
                    required
                  ></textarea>
                </div>

                {/* Form Status Message */}
                {formStatus.message && (
                  <div className={`form-status ${formStatus.type}`}>
                    <i className={`fas ${formStatus.type === 'success' ? 'fa-check-circle' : formStatus.type === 'error' ? 'fa-exclamation-circle' : 'fa-spinner fa-spin'}`}></i>
                    {formStatus.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={formStatus.isSubmitting}
                >
                  {formStatus.isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <h2>Get in Touch</h2>
              
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Phone</h3>
                    <p>
                      <a href="tel:+94702288999">+94702288999</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Email</h3>
                    <p>
                      <a href="mailto:snapssolid@gmail.com">
                        snapssolid@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Service Areas</h3>
                    <p>Colombo, Kandy, Galle<br />& All Over Sri Lanka</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Availability</h3>
                    <p>Available 7 days a week<br />Flexible timing for events</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="contact-social">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a 
                    href="https://web.facebook.com/solidweddings" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <i className="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/solidweddingsofficial" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <i className="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                  <a 
                    href="https://wa.me/+94702288999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <i className="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Quick Response */}
              <div className="quick-response">
                <h3>Quick Response</h3>
                <p>
                  Need immediate assistance? Call us directly or send a WhatsApp 
                  message for fastest response.
                </p>
                <div className="quick-buttons">
                  <a 
                    href="tel:+94702288999" 
                    className="btn btn-secondary"
                  >
                    <i className="fas fa-phone"></i> Call Now
                  </a>
                  <a 
                    href="https://wa.me/+94702288999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-success"
                  >
                    <i className="fab fa-whatsapp"></i> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How far in advance should I book?</h3>
              <p>
                We recommend booking 6-12 months in advance, especially for 
                peak wedding season (December-April). However, we do accept 
                last-minute bookings based on availability.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you travel outside Colombo?</h3>
              <p>
                Yes! We provide services all over Sri Lanka. Travel costs may 
                apply for destinations outside Colombo metro area.
              </p>
            </div>
            <div className="faq-item">
              <h3>How long to receive photos?</h3>
              <p>
                You'll receive a sneak peek within 48 hours and the complete 
                edited gallery within 4-6 weeks after your wedding.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can we customize packages?</h3>
              <p>
                Absolutely! We understand every wedding is unique and we're 
                happy to create custom packages to fit your specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;