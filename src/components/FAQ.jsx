import React, { useState } from 'react';

const faqs = [
  {
    q: 'How long does a typical CCTV installation take?',
    a: 'For a standard 4-camera setup in a residential home, installation usually takes about 4 to 6 hours. Commercial installations with more cameras or complex wiring may take 1-3 days depending on the site size.',
  },
  {
    q: 'Do you provide a warranty on the cameras and installation?',
    a: 'Yes! We provide a 1-year free on-site service warranty for our installations, and pass on the full manufacturer warranty (typically 1 to 2 years) for all OEM hardware like CP PLUS, Hikvision, and Dahua.',
  },
  {
    q: 'Can I view my cameras on my mobile phone?',
    a: 'Absolutely. We configure the DVR/NVR to connect to your internet router. You can view live footage and playback recordings from anywhere in the world using the secure mobile app (e.g., gCMOB, Hik-Connect, DMSS) on iOS or Android.',
  },
  {
    q: 'What is an AMC (Annual Maintenance Contract)?',
    a: 'An AMC ensures your security system is always running smoothly. It includes 4 preventive maintenance visits a year, prioritized emergency support within 24 hours, camera cleaning, and system health checks. Parts replacement is billed separately.',
  },
  {
    q: 'Do you offer site surveys before providing a quotation?',
    a: 'Yes, we offer free, no-obligation site surveys in Hyderabad. Our technician will visit your location, recommend optimal camera positions, calculate cable requirements, and give you a precise quote.',
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" style={{ backgroundColor: '#ffffff', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Have questions about our CCTV installation or services? Here are some of the most common queries we receive.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} style={{
                background: '#fff',
                border: `1px solid ${isOpen ? '#ff4a00' : '#e5e7eb'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: isOpen ? '0 4px 14px rgba(255,74,0,0.06)' : 'none',
              }}>
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isOpen ? '#ff4a00' : '#111827',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  {faq.q}
                  <span style={{ 
                    fontSize: '1.5rem', 
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                    color: isOpen ? '#ff4a00' : '#9ca3af',
                  }}>
                    +
                  </span>
                </button>
                
                <div style={{
                  maxHeight: isOpen ? '200px' : '0',
                  opacity: isOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  padding: isOpen ? '0 1.5rem 1.25rem 1.5rem' : '0 1.5rem',
                  color: '#4b5563',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}>
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
