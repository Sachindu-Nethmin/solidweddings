import { useState } from 'react';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import Footer from '../components/Footer.jsx';
import { useReveal } from '../components/useReveal.js';

const heroImages = [
  `${import.meta.env.BASE_URL}images/weddings/467696682_943824070943067_9155044915667421983_n.jpg`,
  `${import.meta.env.BASE_URL}images/weddings/467643997_943824010943073_1011805423029436531_n.jpg`,
  `${import.meta.env.BASE_URL}images/weddings/467717505_943824147609726_5116480860040812036_n.jpg`,
];

const INFO = [
  { i: 'fa-phone', t: 'Phone', lines: ['+94 70 228 8999'], href: 'tel:+94702288999' },
  { i: 'fa-envelope', t: 'Email', lines: ['solidwedding@gmail.com'], href: 'mailto:solidwedding@gmail.com' },
  { i: 'fa-map-marker-alt', t: 'Service Areas', lines: ['Colombo, Kandy, Galle', '& All Over Sri Lanka'] },
  { i: 'fa-clock', t: 'Availability', lines: ['7 days a week', 'Flexible timing for events'] },
];

const FAQ = [
  { q: 'How far in advance should I book?', a: 'We recommend booking 6-12 months in advance, especially for peak wedding season (December-April). Last-minute bookings are accepted based on availability.' },
  { q: 'Do you travel outside Colombo?', a: 'Yes! We provide services all over Sri Lanka. Travel costs may apply for destinations outside Colombo metro area.' },
  { q: 'How long to receive photos?', a: "You'll receive a sneak peek within 48 hours and the complete edited gallery within 4-6 weeks after your wedding." },
  { q: 'Can we customize packages?', a: "Absolutely! We understand every wedding is unique and we're happy to create custom packages to fit your specific needs." },
];

export default function Contact() {
  useReveal();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', weddingDate: '', venue: '', package: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, msg: '', type: '' });

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, msg: 'Sending...', type: 'info' });
    try {
      await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, to_email: 'solidwedding@gmail.com' }) });
      setStatus({ submitting: false, msg: 'Thank you! We will get back to you within 24 hours.', type: 'success' });
      setFormData({ name: '', email: '', phone: '', weddingDate: '', venue: '', package: '', message: '' });
      setTimeout(() => setStatus({ submitting: false, msg: '', type: '' }), 5000);
    } catch {
      setStatus({ submitting: false, msg: 'Inquiry received! We will get back to you soon.', type: 'success' });
      setFormData({ name: '', email: '', phone: '', weddingDate: '', venue: '', package: '', message: '' });
      setTimeout(() => setStatus({ submitting: false, msg: '', type: '' }), 5000);
    }
  };

  const inputCls = 'form-input';
  const selectCls = 'form-select';

  return (
    <div className="page-enter">
      <HeroSlideshow images={heroImages} height="58vh">
        <div className="reveal active">
          <h1 style={{ marginBottom: 16 }}>Get In <em>Touch</em></h1>
          <p style={{ fontSize: 18, opacity: .9, letterSpacing: '.05em' }}>Let's discuss your vision and create something beautiful together</p>
        </div>
      </HeroSlideshow>

      <section className="section-padding">
        <div className="container-lg">
          <div className="split-grid" style={{ alignItems: 'start' }}>
            {/* Form */}
            <div className="reveal">
              <h2 style={{ marginBottom: 24 }}>Get Your Free <em>Quote</em></h2>
              <p style={{ color: 'var(--ink-3)', marginBottom: 32 }}>Fill out the form and we'll get back to you within 24 hours.</p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <input required placeholder="Full Name *" className={inputCls} value={formData.name} onChange={e => set('name', e.target.value)} />
                  <input required type="email" placeholder="Email *" className={inputCls} value={formData.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <input required type="tel" placeholder="Phone *" className={inputCls} value={formData.phone} onChange={e => set('phone', e.target.value)} />
                  <input type="date" className={inputCls} value={formData.weddingDate} onChange={e => set('weddingDate', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <input placeholder="Wedding Venue" className={inputCls} value={formData.venue} onChange={e => set('venue', e.target.value)} />
                  <select className={selectCls} value={formData.package} onChange={e => set('package', e.target.value)}>
                    <option value="">Select Package</option>
                    <option value="essential">Essential</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <textarea required placeholder="Tell us about your wedding *" className={inputCls} rows={5} value={formData.message} onChange={e => set('message', e.target.value)} style={{ resize: 'vertical' }} />
                {status.msg && (
                  <div style={{ padding: '12px 16px', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 500, background: status.type === 'success' ? 'rgba(192,160,98,.12)' : status.type === 'error' ? 'rgba(220,60,60,.1)' : 'rgba(0,0,0,.04)', color: status.type === 'success' ? 'var(--gold-text)' : status.type === 'error' ? '#c44' : 'var(--ink-3)' }}>
                    <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : status.type === 'error' ? 'fa-exclamation-circle' : 'fa-spinner fa-spin'}`} style={{ marginRight: 8 }} />{status.msg}
                  </div>
                )}
                <button type="submit" className="btn-primary" disabled={status.submitting} style={{ alignSelf: 'flex-start' }}>
                  {status.submitting ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }} />Sending...</> : <><i className="fas fa-paper-plane" style={{ marginRight: 8 }} />Send Inquiry</>}
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="reveal">
              <div className="glass-card" style={{ padding: 40, marginBottom: 32 }}>
                <h3 style={{ marginBottom: 28, fontSize: 22 }}>Contact Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {INFO.map(item => (
                    <div key={item.t} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`fas ${item.i}`} style={{ color: 'var(--gold)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.t}</div>
                        {item.lines.map(l => item.href
                          ? <a key={l} href={item.href} style={{ fontSize: 14, color: 'var(--ink-3)', textDecoration: 'none', display: 'block' }}>{l}</a>
                          : <span key={l} style={{ fontSize: 14, color: 'var(--ink-3)', display: 'block' }}>{l}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28, paddingTop: 28, borderTop: '1px solid var(--cream-3)', display: 'flex', gap: 14 }}>
                  {[
                    { i: 'fa-facebook-f', href: 'https://web.facebook.com/solidweddings' },
                    { i: 'fa-instagram', href: 'https://www.instagram.com/solid_weddings/' },
                    { i: 'fab fa-whatsapp', href: 'https://wa.me/+94702288999' },
                  ].map(s => (
                    <a key={s.i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', transition: 'background .3s ease' }}>
                      <i className={`fab ${s.i}`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--cream-2)' }}>
        <div className="container-lg">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="form-label">FAQ</span>
            <h2>Frequently Asked <em>Questions</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 28, maxWidth: 1100, margin: '0 auto' }}>
            {FAQ.map(f => (
              <div key={f.q} className="reveal glass-card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: 18, marginBottom: 12 }}>{f.q}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.8 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
