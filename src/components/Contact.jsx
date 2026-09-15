import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Get a <span>Quick Quote</span></h2>
        <div style={{ padding: '3rem', borderRadius: '20px', maxWidth: '800px', margin: '0 auto', background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
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
    </section>
  );
};

export default Contact;
