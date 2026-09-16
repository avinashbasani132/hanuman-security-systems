import React, { useRef, useEffect, useState } from 'react';

const solutions = [
  {
    name: 'Banking & Finance',
    icon: '🏦',
    tags: ['ATM Surveillance', 'Vault Monitoring', 'Access Control'],
    desc: 'End-to-end security for bank branches, ATMs and data centres with 24/7 HD recording and AI intrusion detection.',
    img: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&q=80',
    gradient: 'linear-gradient(160deg, rgba(21,101,192,0.88) 0%, rgba(13,71,161,0.72) 50%, rgba(0,0,0,0.55) 100%)',
    accent: '#64b5f6',
    badge: '#1565c0',
  },
  {
    name: 'Education',
    icon: '🎓',
    tags: ['Campus Coverage', 'Entry/Exit Control', 'Child Safety'],
    desc: 'Create a safe campus environment with wide-area dome cameras, face recognition at entry gates and real-time alert systems.',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    gradient: 'linear-gradient(160deg, rgba(46,125,50,0.88) 0%, rgba(27,94,32,0.72) 50%, rgba(0,0,0,0.55) 100%)',
    accent: '#a5d6a7',
    badge: '#2e7d32',
  },
  {
    name: 'Healthcare',
    icon: '🏥',
    tags: ['Patient Safety', 'Ward Monitoring', 'Drug Store Security'],
    desc: 'Monitor wards, ICUs, pharmacies and corridors to ensure patient safety and compliance with healthcare regulations.',
    img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
    gradient: 'linear-gradient(160deg, rgba(183,28,28,0.85) 0%, rgba(198,40,40,0.68) 50%, rgba(0,0,0,0.55) 100%)',
    accent: '#ef9a9a',
    badge: '#c62828',
  },
  {
    name: 'Retail & Malls',
    icon: '🏬',
    tags: ['Anti-Theft', 'POS Monitoring', 'Heat Mapping'],
    desc: 'Reduce shrinkage, monitor checkout points and analyse footfall with intelligent retail CCTV and AI-powered analytics.',
    img: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80',
    gradient: 'linear-gradient(160deg, rgba(230,81,0,0.88) 0%, rgba(191,54,12,0.72) 50%, rgba(0,0,0,0.55) 100%)',
    accent: '#ffcc80',
    badge: '#e65100',
  },
  {
    name: 'Industrial & Warehouses',
    icon: '🏭',
    tags: ['Perimeter Security', 'Worker Safety', 'Fire Detection'],
    desc: 'Ruggedised cameras for harsh environments monitor large perimeters, enforce safety compliance and detect fire in real time.',
    img: 'https://images.unsplash.com/photo-1565793979168-c0a2d8b1d1ab?w=800&q=80',
    gradient: 'linear-gradient(160deg, rgba(62,39,35,0.90) 0%, rgba(78,52,46,0.72) 50%, rgba(0,0,0,0.55) 100%)',
    accent: '#ffab91',
    badge: '#4e342e',
  },
  {
    name: 'Real Estate & Housing',
    icon: '🏢',
    tags: ['Lobby & Lift', 'Parking', 'Night Vision'],
    desc: 'Protect residential complexes and commercial towers with lobby cameras, parking surveillance and remote mobile viewing.',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    gradient: 'linear-gradient(160deg, rgba(74,20,140,0.88) 0%, rgba(106,27,154,0.72) 50%, rgba(0,0,0,0.55) 100%)',
    accent: '#ce93d8',
    badge: '#6a1b9a',
  },
  {
    name: 'Transport & Logistics',
    icon: '🚆',
    tags: ['Fleet Tracking', 'Loading Bay', 'Traffic Monitoring'],
    desc: 'Secure depots, loading bays and transit hubs with vehicle-triggered cameras and LPR recognition.',
    img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
    gradient: 'linear-gradient(160deg, rgba(0,96,100,0.88) 0%, rgba(0,121,107,0.72) 50%, rgba(0,0,0,0.55) 100%)',
    accent: '#80cbc4',
    badge: '#00695c',
  },
  {
    name: 'Safe City & Government',
    icon: '🏙️',
    tags: ['Public Spaces', 'Traffic Control', 'Emergency Response'],
    desc: 'City-scale video surveillance with AI crowd analysis, traffic management and incident detection.',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    gradient: 'linear-gradient(160deg, rgba(13,71,161,0.88) 0%, rgba(21,101,192,0.65) 50%, rgba(0,0,0,0.6) 100%)',
    accent: '#90caf9',
    badge: '#0d47a1',
  },
];

/* ── Individual Solution Card ── */
const SolutionCard = ({ sol, index }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const delay = (index % 4) * 120; // stagger within each row

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '320px',
        cursor: 'default',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.96)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.34,1.1,0.64,1) ${delay}ms`,
      }}
      onMouseEnter={e => {
        const img = e.currentTarget.querySelector('.sol-bg-img');
        if (img) img.style.transform = 'scale(1.08)';
        const overlay = e.currentTarget.querySelector('.sol-overlay');
        if (overlay) overlay.style.opacity = '0.92';
      }}
      onMouseLeave={e => {
        const img = e.currentTarget.querySelector('.sol-bg-img');
        if (img) img.style.transform = 'scale(1)';
        const overlay = e.currentTarget.querySelector('.sol-overlay');
        if (overlay) overlay.style.opacity = '1';
      }}
    >
      {/* Background Image */}
      <img
        className="sol-bg-img"
        src={sol.img}
        alt={sol.name}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.55s ease',
          zIndex: 0,
        }}
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div
        className="sol-overlay"
        style={{
          position: 'absolute', inset: 0,
          background: sol.gradient,
          zIndex: 1,
          transition: 'opacity 0.4s',
        }}
      />

      {/* Decorative circle glow */}
      <div style={{
        position: 'absolute', bottom: '-40px', right: '-40px',
        width: '160px', height: '160px',
        borderRadius: '50%',
        background: `${sol.accent}22`,
        border: `1px solid ${sol.accent}33`,
        zIndex: 2,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3,
        padding: '1.75rem',
        display: 'flex', flexDirection: 'column',
        height: '100%', minHeight: '320px',
      }}>

        {/* Icon badge */}
        <div style={{
          width: '52px', height: '52px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          {sol.icon}
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 900,
          color: '#ffffff',
          margin: '0 0 0.6rem',
          lineHeight: 1.2,
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {sol.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.83rem',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.7,
          margin: '0 0 1.25rem',
          flex: 1,
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}>
          {sol.desc}
        </p>

        {/* Colorful tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {sol.tags.map((tag, ti) => (
            <span key={ti} style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              padding: '0.28rem 0.65rem',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.15)',
              color: sol.accent,
              border: `1px solid ${sol.accent}60`,
              backdropFilter: 'blur(4px)',
              letterSpacing: '0.02em',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Get Quote link */}
        <a href="#contact" style={{
          marginTop: '1.25rem',
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.78rem', fontWeight: 700,
          color: sol.accent,
          textDecoration: 'none',
          letterSpacing: '0.03em',
        }}>
          Get a Quote →
        </a>
      </div>
    </div>
  );
};

/* ── Main Section ── */
const Solutions = () => {
  return (
    <section id="solutions" style={{ background: 'linear-gradient(180deg,#0f172a 0%,#1e293b 100%)', padding: '5rem 0' }}>
      <div className="container">

        {/* ── HEADER ── */}
        <div data-sr="fade-up" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(255,74,0,0.15)',
            color: '#ff6b35',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0.35rem 1rem',
            borderRadius: '999px',
            marginBottom: '1.1rem',
            border: '1px solid rgba(255,74,0,0.3)',
          }}>
            Industry Verticals
          </span>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '2.4rem', fontWeight: 900,
            color: '#f8fafc',
            marginBottom: '0.75rem',
            letterSpacing: '-0.5px',
          }}>
            Tailored Security for <span style={{ color: '#ff4a00' }}>Every Industry</span>
          </h2>
          <p style={{
            color: '#94a3b8',
            maxWidth: '560px', margin: '0 auto 3rem',
            fontSize: '0.95rem', lineHeight: 1.75,
          }}>
            We don't believe in one-size-fits-all. Each industry has unique risks — our solutions are designed to address them precisely.
          </p>
        </div>

        {/* ── STATS ROW ── */}
        <div data-sr="zoom-in" className="stats-row" style={{ marginBottom: '3rem' }}>
          {[
            { num: '8+',   label: 'Industries Served' },
            { num: '500+', label: 'Installations Done' },
            { num: '24/7', label: 'Monitoring Ready' },
            { num: '5★',   label: 'Customer Rating' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ff4a00', fontFamily: 'Outfit, sans-serif' }}>{s.num}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── IMAGE CARDS GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {solutions.map((sol, i) => (
            <SolutionCard key={i} sol={sol} index={i} />
          ))}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div data-sr="fade-up" style={{
          marginTop: '3.5rem',
          background: 'rgba(255,74,0,0.08)',
          border: '1.5px solid rgba(255,74,0,0.25)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          backdropFilter: 'blur(10px)',
        }}>
          <div>
            <h3 style={{ color: '#f1f5f9', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.3rem', fontFamily: 'Outfit, sans-serif' }}>
              Don't see your industry?
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
              We design custom CCTV solutions for any requirement. Talk to our experts.
            </p>
          </div>
          <a href="#contact" style={{
            background: 'linear-gradient(135deg,#ff4a00,#ff6b2b)',
            color: '#fff',
            padding: '0.85rem 2rem',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 6px 20px rgba(255,74,0,0.4)',
          }}>
            Request a Custom Solution →
          </a>
        </div>

      </div>

      <style>{`
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
        }
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr 1fr; }
        }
        /* Mobile: solution cards 1 column */
        @media (max-width: 480px) {
          #solutions .container > div[style*="auto-fill"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 360px) {
          #solutions .container > div[style*="auto-fill"] {
            grid-template-columns: 1fr !important;
          }
        }
        h2[style*="Tailored"] { font-size: clamp(1.5rem, 5vw, 2.4rem) !important; }
      `}</style>
    </section>
  );
};

export default Solutions;
