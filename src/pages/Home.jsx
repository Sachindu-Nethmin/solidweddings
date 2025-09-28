import React from 'react';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Solid Weddings</h1>
            <p className="hero-subtitle">
              Capturing Your Most Precious Moments with Artistic Excellence
            </p>
            <div className="hero-buttons">
              <a href="/gallery" className="btn btn-primary">View Gallery</a>
              <a href="/contact" className="btn btn-secondary">Get Quote</a>
            </div>
          </div>
        </div>
        <img 
          src="/images/weddings/453353797_868177951841013_4737084022978926838_n.jpg" 
          alt="Wedding Photography"
          className="hero-image"
        />
      </section>

      {/* About Section */}
      <section className="about-preview">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Solid Weddings</h2>
              <p>
                Welcome to Solid Weddings, where every moment becomes a timeless memory. 
                We specialize in capturing the magic of your special day with artistic 
                photography that tells your unique love story.
              </p>
              <p>
                Our passion for wedding photography drives us to create stunning images 
                that you'll treasure for a lifetime. From intimate ceremonies to grand 
                celebrations, we're here to document every precious moment.
              </p>
              <a href="/about-me" className="btn btn-outline">Learn More</a>
            </div>
            <div className="about-image">
              <img 
                src="/images/weddings/467459120_943824510943023_6632681943136575200_n.jpg" 
                alt="Wedding Photography Sample"
                className="sample-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <img 
                src="/images/weddings/467744778_943824437609697_1708973942382290310_n.jpg" 
                alt="Wedding Photography"
                className="service-image"
              />
              <h3>Wedding Photography</h3>
              <p>Complete wedding day coverage with professional editing</p>
            </div>
            <div className="service-card">
              <img 
                src="/images/weddings/467525385_943824337609707_4503835412837400410_n.jpg" 
                alt="Pre-wedding Shoots"
                className="service-image"
              />
              <h3>Pre-Wedding Shoots</h3>
              <p>Romantic couple sessions in beautiful locations</p>
            </div>
            <div className="service-card">
              <img 
                src="/images/weddings/467581489_943824560943018_1850348283717679066_n.jpg" 
                alt="Event Photography"
                className="service-image"
              />
              <h3>Event Photography</h3>
              <p>Professional coverage for all your special events</p>
            </div>
          </div>
          <div className="services-cta">
            <a href="/services" className="btn btn-primary">View All Services</a>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="gallery-preview">
        <div className="container">
          <h2 className="section-title">Recent Work</h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img 
                src="/images/weddings/467525658_943824374276370_7508292422335555957_n.jpg" 
                alt="Wedding Photo 1"
                className="gallery-image"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="/images/weddings/467581668_943824124276395_603331384049563710_n.jpg" 
                alt="Wedding Photo 2"
                className="gallery-image"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="/images/weddings/467614283_943824474276360_1770150232184232428_n.jpg" 
                alt="Wedding Photo 3"
                className="gallery-image"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="/images/weddings/467643997_943824010943073_1011805423029436531_n.jpg" 
                alt="Wedding Photo 4"
                className="gallery-image"
              />
            </div>
          </div>
          <div className="gallery-cta">
            <a href="/gallery" className="btn btn-primary">View Full Gallery</a>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Capture Your Special Day?</h2>
            <p>Let's discuss your wedding photography needs and create memories that last forever.</p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">Get in Touch</a>
              <a href="tel:+94712710881" className="btn btn-secondary">
                <i className="fas fa-phone"></i> Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;