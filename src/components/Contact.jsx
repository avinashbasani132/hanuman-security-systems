import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Get a <span>Quick Quote</span></h2>
        <div className="contact-form-card">
          <form className="contact-form" onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
            <div className="contact-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input type="text" className="form-control" placeholder="Your Name" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input type="email" className="form-control" placeholder="Email Address" required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <select className="form-control" required defaultValue="">
                <option value="" disabled>Select a Product / Service</option>
                <option value="network-cameras">Network Cameras</option>
                <option value="nvr-systems">NVR / DVR Systems</option>
                <option value="smart-locks">Smart Locks</option>
                <option value="biometric">Time & Attendance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <textarea className="form-control" placeholder="Describe your requirements..." required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1.25rem' }}>
              Submit Request
            </button>
          </form>
        </div>
      </div>
      <style>{`
        .contact-form-card {
          padding: 3rem;
          border-radius: 20px;
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
        }
        @media (max-width: 768px) {
          .contact-form-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
