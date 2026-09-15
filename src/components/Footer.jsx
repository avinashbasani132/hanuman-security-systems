import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2 className="logo footer-logo">Hanuman <span>Enterprises</span></h2>
            <p className="footer-text">
              Providing cutting-edge security and surveillance solutions to keep you, your family, and your business safe.
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
              <li><a href="tel:+918800952952">+91-8800952952</a></li>
              <li><a href="mailto:support@hanumanenterprises.com">support@hanumanenterprises.com</a></li>
              <li><a href="#contact">Live Chat</a></li>
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
