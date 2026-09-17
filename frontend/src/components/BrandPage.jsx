import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const BRAND_META = {
  'CP PLUS':   { logo: '/images/logo-cpplus.svg',   tagline: 'India\'s #1 CCTV Brand',        color: '#e53935' },
  'Hikvision': { logo: '/images/logo-hikvision.svg', tagline: 'World Leader in Video Security', color: '#e53935' },
  'Dahua':     { logo: '/images/logo-dahua.svg',     tagline: 'WizSense AI Technology',         color: '#2e7d32' },
  'Axis':      { logo: '/images/logo-axis.svg',      tagline: 'Pioneer of Network Video',       color: '#6a1b9a' },
  'EZVIZ':     { logo: '/images/logo-ezviz.svg',     tagline: 'Smart Home Security',            color: '#e65100' },
  'TP-Link':   { logo: '/images/logo-tplink.svg',    tagline: 'VIGI – Reliable IP Cameras',     color: '#00bcd4' },
};

const BrandPage = ({ brand }) => {
  const { allProducts, cart, addToCart, toggleCart, updateQuantity } = useCart();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [brand]);

  const brandProducts = allProducts.filter(p => p.brand === brand);
  const meta = BRAND_META[brand] || { logo: '', tagline: 'Premium Security Solutions', color: '#ff4a00' };

  return (
    <section className="py-20" style={{ background: '#f8f9fc', minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container">
        
        {/* Breadcrumb / Back */}
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', marginBottom: '1.5rem', transition: 'color 0.2s', background: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-color)'; e.currentTarget.style.borderColor = 'var(--accent-color)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
          <span style={{ fontSize: '1.2rem' }}>←</span> Back to Home
        </a>

        {/* Brand Header */}
        <div className="brand-header-card" style={{ background: '#fff', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '3rem', borderTop: `6px solid ${meta.color}` }}>
          {meta.logo ? (
            <img src={meta.logo} alt={brand} style={{ height: '60px', objectFit: 'contain', marginBottom: '1rem' }} />
          ) : (
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>{brand}</h1>
          )}
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.5px' }}>{meta.tagline}</p>
          <div style={{ marginTop: '1.5rem', background: `${meta.color}15`, color: meta.color, padding: '0.5rem 1.2rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.9rem' }}>
            {brandProducts.length} Products Available
          </div>
        </div>

        {/* Product Grid */}
        {brandProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            No products found for this brand.
          </div>
        ) : (
          <div className="product-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch'
          }}>
            {brandProducts.map((item, idx) => {
              const col = meta.color;
              return (
                <div key={idx} className="card product-card-responsive" onClick={() => window.location.hash = `#product/${encodeURIComponent(item.model)}`} style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; }}>
                  {/* Image */}
                  <div className="product-image-container" style={{ background: '#f8f9fc', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0, padding: '1rem', aspectRatio: '1/1' }}>
                    <img src={item.images && item.images[0] ? item.images[0] : ''} alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={e => {
                        e.target.style.display = 'none';
                        if (e.target.parentNode.querySelector('.fallback-text')) return;
                        const span = document.createElement('span');
                        span.className = 'fallback-text';
                        span.style.cssText = 'color:#9ca3af; font-size:1.5rem; font-weight:800; font-family:Outfit,sans-serif; z-index:1;';
                        span.innerText = item.brand;
                        e.target.parentNode.appendChild(span);
                      }} />
                  </div>
                  
                  {/* Info */}
                  <div className="product-info-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.2rem 1rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', padding: '0.18rem 0.55rem', borderRadius: '999px', background: `${col}15`, color: col, alignSelf: 'flex-start', marginBottom: '0.5rem', border: `1px solid ${col}40` }}>
                      {item.brand}
                    </span>
                    <h3 className="product-card-title" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem', lineHeight: 1.35 }}>{item.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: col, fontWeight: 600, marginBottom: '0.5rem' }}>{item.model}</p>
                    <p className="product-card-desc" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', flex: 1, lineHeight: 1.55 }}>{item.desc}</p>
                    
                    {/* Price and Add Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>
                        {item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'Price on Request'}
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(() => {
                          const cartItem = cart.find(c => c.model === item.model);
                          const qty = cartItem ? cartItem.quantity : 0;
                          return qty > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent-color)', borderRadius: '8px', padding: '0.2rem' }}>
                              <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.model, qty - 1); }} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                              <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem', margin: '0 0.5rem' }}>{qty}</span>
                              <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.model, qty + 1); }} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                          ) : (
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '0.55rem 0.8rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', borderRadius: '8px' }}
                              onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                            >
                              Add 🛒
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandPage;
