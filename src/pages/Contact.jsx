import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    venue: '',
    package: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission to here
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      weddingDate: '',
      venue: '',
      package: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Contact Us</h1>
            <p>Let's Start Planning Your Perfect Wedding Photography</p>
          </div>
        </div>
        <img 
          src="/images/weddings/467833684_943824270943047_5484742608995516360_n.jpg" 
          alt="Contact Solid Weddings"
          className="hero-image"
        />
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

                <button type="submit" className="btn btn-primary">
                  Send Inquiry
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
                      <a href="tel:+94712710881">+94 71 271 0881</a>
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
                      <a href="mailto:solidweddingsofficial@gmail.com">
                        solidweddingsofficial@gmail.com
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
                    href="https://www.facebook.com/solidweddingsofficial" 
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
                    href="https://wa.me/94712710881" 
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
                    href="tel:+94712710881" 
                    className="btn btn-secondary"
                  >
                    <i className="fas fa-phone"></i> Call Now
                  </a>
                  <a 
                    href="https://wa.me/94712710881" 
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