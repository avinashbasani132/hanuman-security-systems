import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, cartCount } = useCart();

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleCart}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1.4rem', position: 'relative', display: 'flex', alignItems: 'center'
            }}
          >
            🛒
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-10px',
                background: '#ef4444', color: '#fff', fontSize: '0.7rem',
                fontWeight: 'bold', borderRadius: '50%', padding: '0.1rem 0.4rem'
              }}>
                {cartCount}
              </span>
            )}
          </button>
          <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
