import { Link } from 'react-router-dom';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import Footer from '../components/Footer.jsx';
import { useReveal } from '../components/useReveal.js';
import { useGallery, allPhotos } from '../lib/useGallery.js';

const FALLBACK = Array.from({ length: 5 }, (_, k) => `https://picsum.photos/seed/sw${900 + k}/1600/900`);

const SERVICES_BASE = [
  {
    t: 'Wedding Day Photography',
    d: 'Complete coverage of your wedding day from preparation to reception — every moment, every emotion.',
    features: ['8-12 hours of coverage', 'Professional editing', 'High-resolution digital gallery', 'Print release included'],
  },
  {
    t: 'Pre-Wedding Photography',
    d: 'Romantic couple sessions in beautiful locations — perfect for save-the-dates or celebrating your love.',
    features: ['2-3 hour session', 'Location scouting', 'Outfit change options', 'Professional retouching'],
  },
  {
    t: 'Bridal Portraits',
    d: 'Elegant bridal portrait sessions capturing beauty and grace — stunning keepsakes for display.',
    features: ['Studio or outdoor options', 'Multiple outfit changes', 'Artistic editing', 'Large format prints'],
  },
  {
    t: 'Event Photography',
    d: 'Coverage for engagement parties, bridal showers, rehearsal dinners — all the celebrations.',
    features: ['Flexible hours', 'Candid and posed shots', 'Quick turnaround', 'Social media ready'],
  },
  {
    t: 'Family Photography',
    d: 'Beautiful family moments during wedding celebrations — lasting memories with loved ones.',
    features: ['Group and individual shots', 'Multi-generational photos', 'Natural interactions', 'Group order options'],
  },
  {
    t: 'Wedding Albums',
    d: 'Beautifully designed heirloom-quality albums that preserve your memories in tangible form.',
    features: ['Premium materials', 'Custom layouts', 'Archival quality', 'Additional copies available'],
  },
];

const PACKAGES = [
  {
    name: 'Essential',
    features: ['6 hours coverage', '200+ edited photos', 'Online gallery', 'Print release', 'USB delivery'],
  },
  {
    name: 'Premium',
    featured: true,
    features: ['10 hours coverage', '400+ edited photos', 'Pre-wedding session', '50 printed photos', 'USB + Cloud delivery'],
  },
  {
    name: 'Luxury',
    features: ['Full day coverage', '600+ edited photos', 'Pre-wedding session', 'Custom wedding album', 'Second photographer'],
  },
];

export default function Services() {
  useReveal();
  const { categories } = useGallery();

  const pool = (() => {
    const imgs = allPhotos(categories).map(p => p.url);
    return imgs.length ? imgs : FALLBACK;
  })();

  const heroPool = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
  const SERVICES = SERVICES_BASE.map((s, i) => ({ ...s, img: pool[i % pool.length] }));

  return (
    <div className="page-enter">
      <HeroSlideshow images={heroPool} height="58vh">
        <div className="reveal active">
          <h1 style={{ marginBottom: 16 }}>Our <em>Services</em></h1>
          <p style={{ fontSize: 18, opacity: .9, letterSpacing: '.05em' }}>Comprehensive packages tailored to capture every precious moment</p>
        </div>
      </HeroSlideshow>

      <section className="section-padding">
        <div className="container-lg">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="form-label">What We Offer</span>
            <h2>Specialized <em>Services</em></h2>
          </div>
          <div className="albums-grid" style={{ gap: 36 }}>
            {SERVICES.map(s => (
              <div key={s.t} className="reveal card" style={{ overflow: 'hidden' }}>
                <div style={{ height: 260, overflow: 'hidden' }}>
                  <img src={s.img} alt={s.t} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }} />
                </div>
                <div style={{ padding: 32 }}>
                  <h3 style={{ fontSize: 22, marginBottom: 12 }}>{s.t}</h3>
                  <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 20 }}>{s.d}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {s.features.map(f => (
                      <li key={f} style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <i className="fas fa-check-circle" style={{ color: 'var(--gold)', fontSize: 11 }} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--cream-2)' }}>
        <div className="container-lg">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="form-label">Pricing</span>
            <h2>Wedding <em>Packages</em></h2>
          </div>
          <div className="albums-grid" style={{ gap: 36, maxWidth: 1100, margin: '0 auto' }}>
            {PACKAGES.map(p => (
              <div key={p.name} className={`reveal glass-card${p.featured ? ' featured' : ''}`} style={{ padding: '48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'visible', ...(p.featured ? { border: '2px solid var(--gold)' } : {}) }}>
                {p.featured && <div className="popular-badge">Most Popular</div>}
                <h3 style={{ fontSize: 26, marginBottom: 8 }}>{p.name} Package</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
                  {p.features.map(f => (
                    <li key={f} style={{ fontSize: 14, color: 'var(--ink-3)', padding: '10px 0', borderBottom: '1px solid var(--cream-3)', textAlign: 'center' }}>{f}</li>
                  ))}
                </ul>
                <Link to={`/booking?package=${encodeURIComponent(p.name)}`} className={p.featured ? 'btn-primary' : 'btn-gold-outline'} style={{ marginTop: 'auto' }}>Get Quote</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="container-lg" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: '#fff', marginBottom: 24 }}>Ready to Book Your <em>Photography?</em></h2>
            <p style={{ maxWidth: 600, margin: '0 auto 40px', opacity: .8 }}>Let's discuss your needs and create a custom package that perfectly captures your special day.</p>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn-primary">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
