import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);

  // Parallax effect: image moves slower than scroll
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 150]);
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.18, delayChildren: 0.12 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.72, ease: [0.2, 0.9, 0.2, 1] } 
    }
  };

  // Image animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.2, ease: [0.2, 0.9, 0.2, 1] } 
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-overlay"></div>
        <motion.div 
          className="hero-content"
          variants={container}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
          aria-label="Hero"
        >
          <motion.h1 className="hero-title" variants={item}>
            Solid Weddings
          </motion.h1>

          <motion.p className="hero-subtitle" variants={item}>
            Capturing Your Most Precious Moments with Artistic Excellence
          </motion.p>

          <motion.div className="hero-buttons" variants={item}>
            <a href="/gallery" className="btn btn-primary">View Gallery</a>
            <a href="/contact" className="btn btn-secondary">Get Quote</a>
          </motion.div>
        </motion.div>
        
        {/* Animated hero image with parallax */}
        {!shouldReduceMotion ? (
          <motion.img 
            src="/images/weddings/453353797_868177951841013_4737084022978926838_n.jpg" 
            alt="Wedding Photography"
            className="hero-image"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            style={{ y: imageY, scale: imageScale }}
          />
        ) : (
          <img 
            src="/images/weddings/453353797_868177951841013_4737084022978926838_n.jpg" 
            alt="Wedding Photography"
            className="hero-image"
          />
        )}
      </section>

      {/* About Section */}
      <section className="about-preview">
        <div className="container">
          <motion.div 
            className="about-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.2 }}
          >
            {/* Left side - Text content */}
            <motion.div 
              className="about-text"
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
            >
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }
                  }
                }}
              >
                About Solid Weddings
              </motion.h2>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.6, delay: 0.1, ease: [0.2, 0.9, 0.2, 1] }
                  }
                }}
              >
                Welcome to Solid Weddings, where every moment becomes a timeless memory. 
                We specialize in capturing the magic of your special day with artistic 
                photography that tells your unique love story.
              </motion.p>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.6, delay: 0.2, ease: [0.2, 0.9, 0.2, 1] }
                  }
                }}
              >
                Our passion for wedding photography drives us to create stunning images 
                that you'll treasure for a lifetime. From intimate ceremonies to grand 
                celebrations, we're here to document every precious moment.
              </motion.p>
              <motion.a 
                href="/about-me" 
                className="btn btn-outline"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.6, delay: 0.3, ease: [0.2, 0.9, 0.2, 1] }
                  }
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.a>
            </motion.div>

            {/* Right side - Image */}
            <motion.div 
              className="about-image"
              variants={{
                hidden: { opacity: 0, x: 50, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  scale: 1,
                  transition: { duration: 0.8, delay: 0.2, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: -2,
                transition: { duration: 0.4, ease: [0.2, 0.9, 0.2, 1] }
              }}
              style={{ 
                perspective: 1000,
                transformStyle: 'preserve-3d'
              }}
            >
              <motion.img 
                src="/images/weddings/467459120_943824510943023_6632681943136575200_n.jpg" 
                alt="Wedding Photography Sample"
                className="sample-image"
                whileHover={{
                  boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
                  transition: { duration: 0.4 }
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
          >
            Our Services
          </motion.h2>
          
          <motion.div 
            className="services-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            <motion.div 
              className="service-card"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/images/weddings/467744778_943824437609697_1708973942382290310_n.jpg" 
                alt="Wedding Photography"
                className="service-image"
              />
              <h3>Wedding Photography</h3>
              <p>Complete wedding day coverage with professional editing</p>
            </motion.div>
            
            <motion.div 
              className="service-card"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/images/weddings/467525385_943824337609707_4503835412837400410_n.jpg" 
                alt="Pre-wedding Shoots"
                className="service-image"
              />
              <h3>Pre-Wedding Shoots</h3>
              <p>Romantic couple sessions in beautiful locations</p>
            </motion.div>
            
            <motion.div 
              className="service-card"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/images/weddings/467581489_943824560943018_1850348283717679066_n.jpg" 
                alt="Event Photography"
                className="service-image"
              />
              <h3>Event Photography</h3>
              <p>Professional coverage for all your special events</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="services-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <motion.a 
              href="/services" 
              className="btn btn-primary"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: '0 12px 35px rgba(255, 107, 107, 0.35)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              View All Services
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="gallery-preview">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
          >
            Recent Work
          </motion.h2>
          
          <motion.div 
            className="gallery-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.12
                }
              }
            }}
          >
            <motion.div 
              className="gallery-item"
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
              whileHover={{ 
                scale: 1.03,
                zIndex: 10,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/images/weddings/467525658_943824374276370_7508292422335555957_n.jpg" 
                alt="Wedding Photo 1"
                className="gallery-image"
              />
              <motion.div 
                className="gallery-overlay"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="view-text">View</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="gallery-item"
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
              whileHover={{ 
                scale: 1.03,
                zIndex: 10,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/images/weddings/467581668_943824124276395_603331384049563710_n.jpg" 
                alt="Wedding Photo 2"
                className="gallery-image"
              />
              <motion.div 
                className="gallery-overlay"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="view-text">View</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="gallery-item"
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
              whileHover={{ 
                scale: 1.03,
                zIndex: 10,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/images/weddings/467614283_943824474276360_1770150232184232428_n.jpg" 
                alt="Wedding Photo 3"
                className="gallery-image"
              />
              <motion.div 
                className="gallery-overlay"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="view-text">View</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="gallery-item"
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
              whileHover={{ 
                scale: 1.03,
                zIndex: 10,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/images/weddings/467643997_943824010943073_1011805423029436531_n.jpg" 
                alt="Wedding Photo 4"
                className="gallery-image"
              />
              <motion.div 
                className="gallery-overlay"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="view-text">View</span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="gallery-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <motion.a 
              href="/gallery" 
              className="btn btn-primary"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: '0 12px 35px rgba(255, 107, 107, 0.35)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              View Full Gallery
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
            >
              Ready to Capture Your Special Day?
            </motion.h2>
            
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
            >
              Let's discuss your wedding photography needs and create memories that last forever.
            </motion.p>
            
            <motion.div 
              className="cta-buttons"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }
                }
              }}
            >
              <motion.a 
                href="/contact" 
                className="btn btn-primary"
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: '0 12px 35px rgba(255, 255, 255, 0.25)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Get in Touch
              </motion.a>
              
              <motion.a 
                href="tel:+94712710881" 
                className="btn btn-secondary"
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <i className="fas fa-phone"></i> Call Now
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;