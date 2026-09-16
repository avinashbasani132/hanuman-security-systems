import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneNumber = "919014612983";
    
    let text = `*NEW QUOTE REQUEST*\n\n`;
    text += `*Name:* ${formData.name}\n`;
    if (formData.email) text += `*Email:* ${formData.email}\n`;
    text += `*Contact No:* ${formData.contact}\n`;
    if (formData.service) text += `*Service:* ${formData.service}\n`;
    text += `*Message:*\n${formData.message}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.location.href = whatsappUrl;
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Get a <span>Quick Quote</span></h2>
        <div className="contact-form-card">
          <form className="contact-form" onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Your Name" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Email Address" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input type="tel" name="contact" value={formData.contact} onChange={handleChange} className="form-control" placeholder="Contact Number" required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <select name="service" value={formData.service} onChange={handleChange} className="form-control" required>
                <option value="" disabled>Select a Product / Service</option>
                <option value="Network Cameras">Network Cameras</option>
                <option value="NVR / DVR Systems">NVR / DVR Systems</option>
                <option value="Smart Locks">Smart Locks</option>
                <option value="Time & Attendance">Time & Attendance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <textarea name="message" value={formData.message} onChange={handleChange} className="form-control" placeholder="Describe your requirements..." required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Submit Request via WhatsApp
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
