import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>About Solid Weddings</h1>
            <p>Passionate Wedding Photographers Dedicated to Your Story</p>
          </div>
        </div>
        <img 
          src="/images/2 (1).png" 
          alt="About Solid Weddings"
          className="hero-image"
        />
      </section>

      {/* Main Content */}
      <section className="about-content">
        <div className="container">
          <div className="content-grid">
            <div className="text-content">
              <h2>Our Story</h2>
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
            <div className="image-content">
              <img 
                src="/images/1 (1).png" 
                alt="Wedding Photography Style"
                className="about-image"
              />
            </div>
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
                src="/images/3 (1).png" 
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