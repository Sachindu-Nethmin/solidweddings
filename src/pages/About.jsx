import { Link } from 'react-router-dom';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import Footer from '../components/Footer.jsx';
import { useReveal } from '../components/useReveal.js';
import { useGallery, allPhotos } from '../lib/useGallery.js';

const FALLBACK = Array.from({ length: 5 }, (_, k) => `https://picsum.photos/seed/sw${900 + k}/1600/900`);

const VALUES = [
  { t: 'Authenticity', d: 'We capture raw, unfiltered emotions as they happen, avoiding forced poses.', i: 'fa-heart' },
  { t: 'Artistry', d: 'Masterful composition and lighting turn fleeting moments into timeless art.', i: 'fa-camera' },
  { t: 'Connection', d: 'We build deep trust with our couples to capture their most intimate moments.', i: 'fa-users' },
  { t: 'Legacy', d: 'Heirloom-quality imagery designed to be cherished for generations to come.', i: 'fa-clock-rotate-left' },
];

export default function About() {
  const { categories } = useGallery();
  useReveal([categories.length]);

  const pool = (() => {
    const imgs = allPhotos(categories).map(p => p.url);
    return imgs.length ? imgs.slice(0, 5) : FALLBACK;
  })();

  return (
    <div className="page-enter">
      <HeroSlideshow images={pool} height="58vh">
        <div className="reveal active">
          <h1 style={{ marginBottom: 16 }}>Our <em>Story</em></h1>
          <p style={{ fontSize: 18, opacity: .9, letterSpacing: '.05em' }}>Preserving the soul of your love story since 2012.</p>
        </div>
      </HeroSlideshow>

      <section className="section-padding">
        <div className="container-lg">
          <div className="split-grid">
            <div className="reveal">
              <span className="form-label" style={{ color: 'var(--gold-text)' }}>The Beginning</span>
              <h2 style={{ marginBottom: 24 }}>Driven by <em>Emotion</em>, Perfected by Craft</h2>
              <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>
                Welcome to Solid Weddings. We believe every wedding is a unique masterpiece — a collection of fleeting moments that deserve to be preserved with the utmost care and artistic vision.
              </p>
              <p style={{ color: 'var(--ink-3)' }}>
                What began as a personal passion for visual storytelling has evolved into one of Sri Lanka's most sought-after photography studios, defined by the hundreds of couples who have trusted us with their most precious memories.
              </p>
            </div>
            <div className="reveal">
              <div className="glass-card" style={{ padding: 12 }}>
                <img src={pool[2]} alt="About" style={{ width: '100%', borderRadius: 'var(--radius)', height: 520, objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--cream-2)' }}>
        <div className="container-lg">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="form-label">Our Values</span>
            <h2>The <em>Philosophy</em> Behind the Lens</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 28 }}>
            {VALUES.map(v => (
              <div key={v.t} className="reveal glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <div className="value-icon"><i className={`fas ${v.i}`} /></div>
                <h3 style={{ marginBottom: 14, fontSize: 22 }}>{v.t}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.8 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-lg">
          <div className="split-grid" style={{ direction: 'rtl' }}>
            <div className="reveal" style={{ direction: 'ltr' }}>
              <span className="form-label" style={{ color: 'var(--gold-text)' }}>Excellence</span>
              <h2 style={{ marginBottom: 24 }}>Why Choose <em>Solid Weddings</em></h2>
              <div style={{ display: 'grid', gap: 20 }}>
                {[
                  '12+ years of professional wedding experience',
                  'High-end full-frame mirrorless equipment',
                  'Bespoke post-processing for every single image',
                  'Comprehensive coverage from dawn till dusk',
                  'Heirloom leather albums handcrafted in Italy',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <i className="fas fa-check-circle" style={{ color: 'var(--gold)' }} />
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn-primary" style={{ marginTop: 40 }}>Work With Us</Link>
            </div>
            <div className="reveal">
              <div className="glass-card" style={{ padding: 12 }}>
                <img src={pool[3]} alt="Professionalism" style={{ width: '100%', borderRadius: 'var(--radius)', height: 520, objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="container-lg" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: '#fff', marginBottom: 24 }}>Let's Create <em>Magic</em> Together</h2>
            <p style={{ maxWidth: 600, margin: '0 auto 40px', opacity: .8 }}>Ready to discuss your photography needs? We'd love to hear about your special day.</p>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary">Get in Touch</Link>
              <Link to="/gallery" className="btn-gold-outline" style={{ color: '#fff', borderColor: '#fff' }}>View Gallery</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
