import React from 'react';

const features = [
  {
    icon: '🛡️',
    title: '1-Year Free Service Warranty',
    desc: 'We stand by our work. Every installation comes with a comprehensive 1-year on-site service warranty.',
  },
  {
    icon: '✔️',
    title: '100% Genuine OEM Products',
    desc: 'We are authorised dealers for top brands like CP PLUS, Hikvision, and Dahua. No fakes, only genuine hardware.',
  },
  {
    icon: '👨‍🔧',
    title: 'Certified Expert Technicians',
    desc: 'Our installation team is highly trained, background-verified, and follows strict cabling and safety standards.',
  },
  {
    icon: '🚀',
    title: 'Same-Day Installation',
    desc: 'We value your time and security. Book a slot and get your system installed and running within 24 hours.',
  },
];

const Features = () => {
  return (
    <section id="features" style={{ backgroundColor: '#ffffff', padding: '4rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">Why Choose <span>Hanuman Enterprises?</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            We don't just sell boxes; we deliver peace of mind. Here is why hundreds of homes and businesses in Hyderabad trust us with their security.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
        }}>
          {features.map((feature, idx) => (
            <div key={idx} style={{
              background: '#f8f9fa',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              border: '1px solid #f0f0f0',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1.5rem',
                display: 'inline-block',
                background: '#fff',
                width: '80px',
                height: '80px',
                lineHeight: '80px',
                borderRadius: '50%',
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
