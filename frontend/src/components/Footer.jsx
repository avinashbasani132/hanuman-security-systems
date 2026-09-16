import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <h2 className="logo footer-logo">Hanuman <span>Enterprises</span></h2>
            <p className="footer-text">
              Professional CCTV installation &amp; security solutions for homes and businesses across Hyderabad.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Products</h4>
            <ul className="footer-links">
              <li><a href="#products">Network Cameras</a></li>
              <li><a href="#products">NVR / DVR</a></li>
              <li><a href="#products">Smart Locks</a></li>
              <li><a href="#products">Time & Attendance</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Solutions</h4>
            <ul className="footer-links">
              <li><a href="#solutions">Banking</a></li>
              <li><a href="#solutions">Real Estate</a></li>
              <li><a href="#solutions">Safe City</a></li>
              <li><a href="#solutions">Industrial</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-links">
              <li><a href="tel:+919014612983">📞 +91-9014612983</a></li>
              <li><a href="https://wa.me/919014612983" target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a></li>
              <li><a href="#contact">Get a Free Quote</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Hanuman Enterprises. All rights reserved.</p>
          <p>Designed for Security, Built for Trust.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
