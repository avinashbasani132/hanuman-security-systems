import React, { useEffect, useState } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header glass ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <a href="/" className="logo">
          Hanuman <span>Enterprises</span>
        </a>
        <nav>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#solutions">Solutions</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>
        <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
          Get a Quote
        </a>
      </div>
    </header>
  );
};

export default Header;
