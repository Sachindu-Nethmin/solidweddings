import React from 'react';

const Services = () => {
  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Our Services</h1>
            <p>Comprehensive Wedding Photography Packages</p>
          </div>
        </div>
        <img 
          src="/images/1-1 (1).png" 
          alt="Wedding Photography Services"
          className="hero-image"
        />
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          
          <div className="services-grid">
            {/* Wedding Photography */}
            <div className="service-card">
              <div className="service-image">
                <img 
                  src="/images/1 (1).png" 
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
                  src="/images/3 (1).png" 
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
                  src="/images/2 (1).png" 
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
                  src="/images/220-Cam-1-1191.png" 
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
                  src="/images/1-2.png" 
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
                  src="/images/1-3.png" 
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