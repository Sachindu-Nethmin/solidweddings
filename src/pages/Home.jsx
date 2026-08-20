import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import Footer from '../components/Footer.jsx';
import { useReveal } from '../components/useReveal.js';
import { useGallery, allPhotos } from '../lib/useGallery.js';

const FALLBACK = Array.from({ length: 5 }, (_, k) =>
  `https://picsum.photos/seed/sw${900 + k}/1600/900`
);

export default function Home() {
  const { categories } = useGallery();
  useReveal([categories.length]);

  const heroPool = (() => {
    const imgs = allPhotos(categories).map(p => p.url);
    if (imgs.length === 0) return FALLBACK;
    return imgs.sort(() => 0.5 - Math.random()).slice(0, 5);
  })();

  const services = [
    { t: 'Wedding Photography', d: 'Comprehensive coverage from pre-dawn rituals to the late-night dance floor.', img: heroPool[1] },
    { t: 'Engagement Sessions', d: 'Romantic, relaxed portraits that tell your story before the big day.', img: heroPool[2] },
    { t: 'Luxury Albums', d: 'Handcrafted Italian leather albums designed to last for generations.', img: heroPool[3] },
  ];

  return (
    <div className="page-enter">
      <HeroSlideshow images={heroPool} height="100vh">
        <div className="reveal active">
          <span className="hero-kicker">Sri Lanka's Premier Studio</span>
          <h1 style={{ marginBottom: 24 }}>Capturing Love<br /><em>Artistically</em></h1>
          <p style={{ fontSize: 18, maxWidth: 600, margin: '0 auto 40px', opacity: .92 }}>
            Timeless wedding photography that preserves your most precious moments with artistic elegance and soulful beauty.
          </p>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/gallery" className="btn-primary">View Portfolio</Link>
            <Link to="/contact" className="btn-gold-outline" style={{ borderColor: '#fff', color: '#fff' }}>Book Session</Link>
          </div>
        </div>
      </HeroSlideshow>

      {/* Stats */}
      <section style={{ background: 'var(--cream-2)', padding: '60px 0', borderBottom: '1px solid var(--cream-3)' }}>
        <div className="container-lg">
          <div className="stats-row">
            {[['500+','Weddings Captured'],['12+','Years Experience'],['100%','Happy Couples'],['15+','International Awards']].map(([n,t]) => (
              <div key={t} className="reveal" style={{ textAlign: 'center' }}>
                <div className="stat-n">{n}</div>
                <div className="stat-t">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="section-padding">
        <div className="container-lg">
          <div className="split-grid">
            <div className="reveal">
              <span className="form-label" style={{ color: 'var(--gold-text)' }}>The Studio</span>
              <h2 style={{ marginBottom: 24 }}>A legacy of <em>Storytelling</em> and Vision</h2>
              <p style={{ color: 'var(--ink-3)', marginBottom: 32 }}>
                We believe wedding photography is more than taking pictures — it's about preserving a legacy.
                Our approach blends fine-art aesthetics with candid storytelling to capture the true essence of your celebration.
              </p>
              <Link to="/about-me" className="btn-gold-outline">Learn Our Story</Link>
            </div>
            <div className="reveal" style={{ position: 'relative' }}>
              <div className="glass-card" style={{ padding: 10, borderRadius: 'var(--radius-lg)' }}>
                <img src={heroPool[0]} alt="Studio" style={{ width: '100%', borderRadius: 'var(--radius)', height: 480, objectFit: 'cover' }} />
              </div>
              <div className="glass-card" style={{ position: 'absolute', bottom: -28, left: -28, padding: '24px 30px', maxWidth: 250 }}>
                <i className="fas fa-quote-left" style={{ color: 'var(--gold)', fontSize: 22, marginBottom: 10 }} />
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>"They didn't just take photos, they captured our emotions."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding" style={{ background: 'var(--cream-2)' }}>
        <div className="container-lg">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="form-label" style={{ color: 'var(--gold-text)' }}>Offerings</span>
            <h2>Our Specialized <em>Services</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 32 }}>
            {services.map(s => (
              <div key={s.t} className="reveal card" style={{ overflow: 'hidden' }}>
                <div style={{ height: 280, overflow: 'hidden' }}>
                  <img src={s.img} alt={s.t} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 32 }}>
                  <h3 style={{ fontSize: 24, marginBottom: 12 }}>{s.t}</h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-3)', marginBottom: 24 }}>{s.d}</p>
                  <Link to="/services" style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold-text)', textTransform: 'uppercase', letterSpacing: '.1em' }}>View Details →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-lg">
          <div className="glass-card" style={{ padding: 'clamp(48px,8vw,80px) 40px', textAlign: 'center', background: 'var(--ink)', color: '#fff', border: 'none' }}>
            <div className="reveal">
              <h2 style={{ color: '#fff', marginBottom: 24 }}>Ready to capture your <em>Story?</em></h2>
              <p style={{ maxWidth: 600, margin: '0 auto 40px', opacity: .8 }}>Every wedding is unique. Let's discuss how we can make your memories timeless.</p>
              <Link to="/contact" className="btn-primary">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
