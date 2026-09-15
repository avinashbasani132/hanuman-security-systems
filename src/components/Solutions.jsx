import React, { useState } from 'react';

const solutions = [
  {
    name: 'Banking & Finance',
    icon: '🏦',
    tags: ['ATM Surveillance', 'Vault Monitoring', 'Access Control'],
    desc: 'End-to-end security for bank branches, ATMs and data centres with 24/7 HD recording, AI intrusion detection and tamper-proof evidence storage.',
  },
  {
    name: 'Retail & Malls',
    icon: '🏬',
    tags: ['Anti-Theft', 'POS Monitoring', 'Heat Mapping'],
    desc: 'Reduce shrinkage, monitor checkout points and analyse footfall with intelligent retail CCTV and AI-powered crowd analytics.',
  },
  {
    name: 'Education',
    icon: '🎓',
    tags: ['Campus Coverage', 'Entry/Exit Control', 'Child Safety'],
    desc: 'Create a safe campus environment with wide-area dome cameras, face recognition at entry gates and real-time alert systems.',
  },
  {
    name: 'Healthcare',
    icon: '🏥',
    tags: ['Patient Safety', 'Ward Monitoring', 'Drug Store Security'],
    desc: 'Monitor wards, ICUs, pharmacies and corridors to ensure patient safety, staff accountability and compliance with healthcare regulations.',
  },
  {
    name: 'Industrial & Warehouses',
    icon: '🏭',
    tags: ['Perimeter Security', 'Worker Safety', 'Fire Detection'],
    desc: 'Ruggedised cameras for harsh environments monitor large perimeters, enforce safety compliance and detect fire or intrusion in real time.',
  },
  {
    name: 'Real Estate & Housing',
    icon: '🏢',
    tags: ['Lobby & Lift', 'Parking', 'Night Vision'],
    desc: 'Protect residential complexes and commercial towers with lobby cameras, parking surveillance, intercom integration and remote mobile viewing.',
  },
  {
    name: 'Transport & Logistics',
    icon: '🚆',
    tags: ['Fleet Tracking', 'Loading Bay', 'Traffic Monitoring'],
    desc: 'Secure depots, loading bays and transit hubs with vehicle-triggered cameras, LPR (license-plate recognition) and GPS-linked monitoring.',
  },
  {
    name: 'Safe City & Government',
    icon: '🏙️',
    tags: ['Public Spaces', 'Traffic Control', 'Emergency Response'],
    desc: 'City-scale video surveillance with AI crowd analysis, traffic management, incident detection and seamless integration with command centres.',
  },
];

const Solutions = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="solutions" style={{ backgroundColor: '#f4f5f7', padding: '7rem 0' }}>
      <div className="container">

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(255,74,0,0.08)',
            color: '#ff4a00',
            fontWeight: 700,
            fontSize: '0.78rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.35rem 1rem',
            borderRadius: '999px',
            marginBottom: '1rem',
            border: '1px solid rgba(255,74,0,0.18)',
          }}>
            Industry Verticals
          </span>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
            Tailored Security for <span>Every Industry</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 3.5rem', fontSize: '1rem', lineHeight: 1.7 }}>
            We don't believe in one-size-fits-all. Each industry has unique risks — our solutions are designed to address them precisely.
          </p>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: '#e5e7eb',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '3.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          {[
            { num: '8+',    label: 'Industries Served' },
            { num: '500+',  label: 'Installations Done' },
            { num: '24/7',  label: 'Monitoring Ready' },
            { num: '5★',    label: 'Customer Rating' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ff4a00', fontFamily: 'Outfit, sans-serif' }}>{s.num}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── SOLUTION CARDS GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {solutions.map((sol, index) => {
            const isHovered = hovered === index;
            return (
              <div
                key={index}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: '#ffffff',
                  border: `1.5px solid ${isHovered ? '#ff4a00' : '#e5e7eb'}`,
                  borderRadius: '16px',
                  padding: '1.75rem',
                  cursor: 'default',
                  transition: 'all 0.3s ease',
                  boxShadow: isHovered ? `0 12px 32px rgba(255,74,0,0.08)` : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                }}
              >
                {/* Icon + Name row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '48px', height: '48px',
                    borderRadius: '12px',
                    background: isHovered ? '#ff4a00' : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                    transition: 'all 0.3s',
                  }}>
                    {sol.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#111827',
                    margin: 0,
                    lineHeight: 1.3,
                  }}>
                    {sol.name}
                  </h3>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.83rem',
                  color: '#6b7280',
                  lineHeight: 1.65,
                  margin: 0,
                  flex: 1,
                }}>
                  {sol.desc}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {sol.tags.map((tag, ti) => (
                    <span key={ti} style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.7rem',
                      borderRadius: '999px',
                      background: isHovered ? 'rgba(255,74,0,0.06)' : '#f8f9fa',
                      color: isHovered ? '#ff4a00' : '#4b5563',
                      border: `1px solid ${isHovered ? 'rgba(255,74,0,0.2)' : '#e5e7eb'}`,
                      transition: 'all 0.3s',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{
          marginTop: '3.5rem',
          background: '#111827',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.4rem', fontFamily: 'Outfit, sans-serif' }}>
              Don't see your industry?
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
              We design custom CCTV solutions for any requirement. Talk to our experts.
            </p>
          </div>
          <a href="#contact" style={{
            background: '#ff4a00',
            color: '#fff',
            padding: '0.85rem 2rem',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '0.92rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 6px 20px rgba(255,74,0,0.35)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,74,0,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,74,0,0.35)'; }}
          >
            Request a Custom Solution →
          </a>
        </div>

      </div>
    </section>
  );
};

export default Solutions;
