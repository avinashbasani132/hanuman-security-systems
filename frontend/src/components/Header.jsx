import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  
  const { toggleCart, cartCount, searchQuery, setSearchQuery, allProducts, setSelectedProduct } = useCart();
  const { user, logout, setShowLoginModal } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim() || !allProducts) return [];
    const q = searchQuery.toLowerCase();
    return allProducts.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.model && p.model.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.desc && p.desc.toLowerCase().includes(q)) ||
      (p.tags && Array.isArray(p.tags) ? p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q)) : (typeof p.tags === 'string' && p.tags.toLowerCase().includes(q)))
    ).slice(0, 6);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setMenuOpen(false);
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
        <div className="desktop-search" style={{ flex: 1, maxWidth: '500px', margin: '0 2rem' }} ref={searchRef}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search products, models, tags..." 
              value={searchQuery || ''}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: '50px',
                border: '1px solid #e5e7eb',
                background: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                transition: 'border-color 0.3s, box-shadow 0.3s'
              }}
              onFocus={(e) => {
                setSearchFocused(true);
                e.target.style.borderColor = '#ea580c';
                e.target.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)';
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.9rem' }}>
              🔍
            </span>
            
            {/* Search Suggestions Dropdown */}
            {searchFocused && searchQuery && searchQuery.trim().length > 0 && (
              <div className="custom-scrollbar" style={{
                position: 'absolute', top: '110%', left: 0, width: '100%',
                background: '#ffffff', borderRadius: '8px', boxShadow: '0 12px 30px rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb', zIndex: 1000, overflowY: 'auto', maxHeight: '450px'
              }}>
                {suggestions.length > 0 ? (
                  suggestions.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        window.location.hash = `#product/${encodeURIComponent(item.model)}`;
                        setSearchQuery('');
                        setSearchFocused(false);
                      }}
                      style={{ 
                        padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', 
                        cursor: 'pointer', borderBottom: idx < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                        transition: 'all 0.2s ease', borderLeft: '3px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.borderLeft = `3px solid #ea580c`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderLeft = '3px solid transparent';
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', background: '#fff', border: '1px solid #f3f4f6', borderRadius: '6px', padding: '0.2rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: '1.4rem', color: '#d1d5db' }}>📷</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{item.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                          <span style={{ fontWeight: 700, color: '#ea580c' }}>{item.brand}</span> <span style={{ opacity: 0.5 }}>|</span> {item.model}
                        </p>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', display: 'flex', alignItems: 'center' }}>
                        {item.price ? `₹${item.price.toLocaleString('en-IN')}` : <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Price on Request</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.95rem' }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>😕</span>
                    No products found for "<strong>{searchQuery}</strong>"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
          
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center' }}>
                👤
              </button>
              {profileDropdownOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', zIndex: 1001, minWidth: '180px' }}>
                  <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280', borderBottom: '1px solid #f3f4f6', wordBreak: 'break-all', marginBottom: '0.2rem' }}>
                    Signed in as<br/><strong style={{ color: '#111827' }}>{user.email}</strong>
                  </div>
                  <a href="#orders" onClick={() => setProfileDropdownOpen(false)} style={{ padding: '0.6rem', textDecoration: 'none', color: '#111827', fontWeight: 600, fontSize: '0.9rem', borderRadius: '8px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    📦 My Orders
                  </a>
                  <button onClick={() => { logout(); setProfileDropdownOpen(false); }} style={{ padding: '0.6rem', textDecoration: 'none', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center' }} title="Log In / Sign Up">
              👤
            </button>
          )}

          <a href="#contact" className="btn btn-primary quote-btn" style={{ padding: '0.5rem 1.5rem' }}>
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
          .desktop-search { display: none; }
          .quote-btn { display: none !important; }
          .mobile-menu-btn { display: block; }
        }
      `}</style>
    </header>
  );
};

export default Header;
