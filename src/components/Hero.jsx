import React from 'react';

const services = [
  { icon: '📷', label: 'Camera Supply & Installation' },
  { icon: '🔧', label: 'DVR / NVR Setup' },
  { icon: '📱', label: 'Mobile Remote Viewing' },
  { icon: '🛡️', label: 'AMC & Maintenance' },
];

const stats = [
  { num: '500+', label: 'Sites Installed' },
  { num: '8+',   label: 'Years Experience' },
  { num: '6',    label: 'Major Brands' },
  { num: '24/7', label: 'Support Available' },
];

const Hero = () => {
  return (
    <section id="home" className="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fc 55%, #fff3ee 100%)',
      paddingTop: '5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* background decoration circles */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '420px', height: '420px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,74,0,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '40%',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,74,0,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="hero-layout">

          {/* ── LEFT COLUMN ── */}
          <div className="animate-fade-in">
            {/* badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,74,0,0.08)',
              border: '1px solid rgba(255,74,0,0.2)',
              borderRadius: '999px',
              padding: '0.35rem 1rem',
              marginBottom: '1.5rem',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff4a00', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ff4a00', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Professional CCTV Installation — Hyderabad
              </span>
            </div>

            {/* headline */}
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '3.6rem',
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: '1.25rem',
            }}>
              Complete CCTV<br />
              <span style={{ color: '#ff4a00' }}>Installation</span><br />
              Services
            </h1>

            {/* subtext */}
            <p style={{
              fontSize: '1.05rem',
              color: '#64748b',
              lineHeight: 1.75,
              marginBottom: '2.25rem',
              maxWidth: '480px',
            }}>
              From camera supply to full setup, remote viewing configuration and annual maintenance — Hanuman Enterprises handles everything for your home or business.
            </p>

            {/* CTA row */}
            <div className="hero-cta-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <a href="#contact" className="hero-btn-primary" style={{
                background: '#ff4a00',
                color: '#ffffff',
                padding: '0.95rem 2.25rem',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(255,74,0,0.32)',
                transition: 'all 0.22s ease',
                display: 'inline-block',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,74,0,0.42)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,74,0,0.32)'; }}
              >
                📞 Get Free Site Survey
              </a>
              <a href="#products" className="hero-btn-secondary" style={{
                background: '#fff',
                color: '#0f172a',
                padding: '0.95rem 2.25rem',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
                border: '1.5px solid #e5e7eb',
                transition: 'all 0.22s ease',
                display: 'inline-block',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff4a00'; e.currentTarget.style.color = '#ff4a00'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#0f172a'; }}
              >
                View Products →
              </a>
            </div>

            {/* stats row */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.7rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="animate-fade-in delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* ── IMAGE GALLERY ── */}
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              height: '340px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              position: 'relative',
            }}>
              <img src="/images/hero-install-real.jpg" alt="CCTV Installation"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.parentNode.style.background = '#e5e7eb'; e.target.style.display = 'none'; }}
              />
              {/* overlay badge */}
              <div style={{
                position: 'absolute', bottom: '16px', left: '16px',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '0.6rem 1rem',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{ fontSize: '1.1rem' }}>📷</span> Professional Camera Installation
              </div>
            </div>

            {/* 2-col service mini-cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {services.map((s, i) => (
                <div key={i} style={{
                  background: '#fff',
                  border: '1.5px solid #f0f0f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff4a00'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,74,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                >
                  <span style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(255,74,0,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0,
                  }}>{s.icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* trust bar */}
            <div style={{
              background: '#fff',
              border: '1.5px solid #f0f0f0',
              borderRadius: '16px',
              padding: '1rem 1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '1.4rem' }}>✅</div>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Authorised Dealer & Installer</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>CP PLUS · Hikvision · Dahua · Axis · EZVIZ · TP-Link</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>📍 Hyderabad</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>& surrounding areas</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .hero-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
        @media (max-width: 768px) {
          .hero {
            padding-top: 8.5rem !important;
          }
        }
        @media (max-width: 480px) {
          .hero-cta-row {
            flex-direction: column;
          }
          .hero-btn-primary, .hero-btn-secondary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
