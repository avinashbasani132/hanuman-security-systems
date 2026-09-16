import React from 'react';

const steps = [
  {
    icon: '📋',
    title: 'Consultation & Site Visit',
    desc: 'We assess your security needs, inspect the premises, and provide a tailored CCTV layout and quotation.',
  },
  {
    icon: '🛠️',
    title: 'Professional Installation',
    desc: 'Our expert technicians install the cameras with clean cabling, optimal viewing angles, and strict safety standards.',
  },
  {
    icon: '📱',
    title: 'Handover & Support',
    desc: 'We configure your devices for remote viewing, train you on the software, and provide a 1-year service warranty.',
  }
];

const Features = () => {
  return (
    <section id="features" style={{ backgroundColor: '#ffffff', padding: '5rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="section-title">How It <span>Works</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Our streamlined process ensures you get the best security system installed with zero hassle.
          </p>
        </div>

        <div className="process-timeline" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          position: 'relative',
          paddingTop: '20px'
        }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{
              position: 'relative',
              textAlign: 'center',
              padding: '2.5rem 2rem',
              background: '#fcfcfc',
              borderRadius: '24px',
              border: '1px solid #f0f0f0',
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(234, 88, 12, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--primary-color)',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)',
                border: '4px solid #fff'
              }}>
                {idx + 1}
              </div>
              
              <div style={{
                fontSize: '3.5rem',
                marginTop: '1rem',
                marginBottom: '1.5rem',
                display: 'inline-block',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
              }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
                {step.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
