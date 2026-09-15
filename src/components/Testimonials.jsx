import React from 'react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    type: 'Residential Customer',
    text: 'Hanuman Enterprises installed 4 CP PLUS cameras at my home. The installation was very neat, no messy wires visible. The technician explained how to use the app clearly. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Srinivas Reddy',
    type: 'Business Owner (Retail)',
    text: 'We upgraded our shop security with their Hikvision ColorVu system. The night vision is incredible, literally looks like daytime. Professional service and very prompt support.',
    rating: 5,
  },
  {
    name: 'Meena Sharma',
    type: 'Apartment Committee Member',
    text: 'They handled the complete society installation (32 cameras + NVR). Finished the project on time and within budget. Their post-installation AMC service is also very reliable.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" style={{ backgroundColor: '#f9fafb', padding: '4rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">Trusted by our <span>Customers</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Don't just take our word for it. See what our clients in Hyderabad have to say about our installation and support services.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
        }}>
          {testimonials.map((t, idx) => (
            <div key={idx} style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{ display: 'flex', gap: '0.2rem', color: '#fbbf24', fontSize: '1.2rem' }}>
                {'★'.repeat(t.rating)}
              </div>
              <p style={{
                color: '#4b5563',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                fontStyle: 'italic',
                flex: 1,
                margin: 0,
              }}>
                "{t.text}"
              </p>
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginTop: 'auto' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{t.name}</h4>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>{t.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
