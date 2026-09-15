import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleCart, cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setMenuOpen(prev => {
        if (prev) return false;
        return prev;
      });
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
        <nav className="desktop-nav">
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
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', fontSize: '1.5rem',
              cursor: 'pointer', color: 'var(--text-primary)', marginLeft: '0.2rem'
            }}
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: '1rem', background: '#fff',
          border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem',
          zIndex: 1001, minWidth: '200px'
        }}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#products" onClick={() => setMenuOpen(false)}>Products</a>
          <a href="#solutions" onClick={() => setMenuOpen(false)}>Solutions</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact Us</a>
        </div>
      )}
      
      <style>{`
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-menu-btn { display: block; }
        }
      `}</style>
    </header>
  );
};

export default Header;
