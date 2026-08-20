import { useState, useEffect } from 'react';

export default function HeroSlideshow({ images = [], height = '100vh', children }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setCurrent(i => (i + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <section className="hero" style={{ height }}>
      {images.map((src, i) => (
        <div
          key={src + i}
          className={`hero-slide${i === current ? ' active' : ''}`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
      <div className="hero-scrim" />
      <div className="container-lg hero-content">
        {children}
      </div>
    </section>
  );
}
