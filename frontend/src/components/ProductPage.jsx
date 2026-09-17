import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const BRAND_COLORS = {
  'CP PLUS': '#e53935',
  'Hikvision': '#e53935',
  'Dahua': '#2e7d32',
  'Axis': '#6a1b9a',
  'EZVIZ': '#e65100',
  'TP-Link': '#00bcd4',
};

const ProductPage = ({ model }) => {
  const { allProducts, cart, updateQuantity, addToCart, toggleCart } = useCart();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [view360, setView360] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [model]);

  // Find product by model
  const product = allProducts.find(p => p.model === model);

  if (!product) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <a href="/" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Home
        </a>
      </div>
    );
  }

  const bc = BRAND_COLORS[product.brand] || '#ff4a00';

  return (
    <div className="product-page-container" style={{ background: '#f8f9fc', minHeight: '80vh', paddingTop: '100px', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        
        <button 
          onClick={() => {
            if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
              window.history.back();
            } else {
              window.location.hash = '';
            }
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', marginBottom: '2rem', transition: 'color 0.2s', background: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }} 
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-color)'; e.currentTarget.style.borderColor = 'var(--accent-color)'; }} 
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span> Go Back
        </button>

        <div className="product-detail-card" style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <div className="product-detail-split" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Images Section */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', background: '#f8f9fc', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
              {product.images && product.images[activeImgIdx] ? (
                <img src={product.images[activeImgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: view360 ? 'drop-shadow(0 20px 20px rgba(0,0,0,0.2))' : 'none', transform: view360 ? 'rotateY(15deg) scale(1.05)' : 'none', transition: 'all 0.5s ease' }} />
              ) : (
                <div style={{ fontSize: '4rem', color: '#d1d5db' }}>📷</div>
              )}
              {product.price && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--accent-color)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(255,74,0,0.3)', fontSize: '1.2rem' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImgIdx(i)} style={{ width: '60px', height: '60px', borderRadius: '8px', border: activeImgIdx === i ? `2px solid var(--accent-color)` : '2px solid transparent', background: '#f8f9fc', padding: '0.2rem', cursor: 'pointer', flexShrink: 0 }}>
                    <img src={img} alt={`thumb-${i}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
            
            {product.images && product.images.length > 0 && (
              <button 
                onClick={() => setView360(!view360)}
                style={{ background: view360 ? 'var(--accent-color)' : '#f3f4f6', color: view360 ? '#fff' : '#4b5563', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                🔄 View in 360°
              </button>
            )}
          </div>

          {/* Details Section */}
          <div style={{ flex: '1 1 400px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.2' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {[product.brand, product.type].map((lbl, li) => (
                <span key={li} style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '999px',
                  background: li === 0 ? `${bc}15` : '#f3f4f6',
                  color: li === 0 ? bc : '#6b7280',
                  border: li === 0 ? `1px solid ${bc}40` : '1px solid #e5e7eb'
                }}>{lbl}</span>
              ))}
            </div>

            <p style={{ color: bc, fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>Model: {product.model}</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '1rem' }}>{product.desc}</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {(Array.isArray(product.tags) ? product.tags : (product.tags ? [product.tags] : [])).map((t, ti) => (
                <span key={ti} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '999px', background: '#fff5f2', color: 'var(--accent-color)', fontWeight: 600, border: '1px solid rgba(255,74,0,0.18)' }}>{t}</span>
              ))}
            </div>

            {product.apps && (
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Best For: </strong>{product.apps}
              </p>
            )}
            
            {(() => {
              const cartItem = cart.find(c => c.model === product.model);
              const qty = cartItem ? cartItem.quantity : 0;
              return qty > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent-color)', borderRadius: '12px', padding: '0.5rem', marginTop: '1rem', width: '100%', maxWidth: '300px' }}>
                  <button onClick={(e) => updateQuantity(product.model, qty - 1)} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                  <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.2rem' }}>{qty} in cart</span>
                  <button onClick={(e) => updateQuantity(product.model, qty + 1)} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              ) : (
                <button 
                  onClick={() => { addToCart(product); }}
                  style={{
                    background: 'var(--accent-color)', color: '#fff',
                    border: 'none', padding: '1rem 2rem', borderRadius: '12px',
                    fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem',
                    width: '100%', maxWidth: '300px', marginTop: '1rem',
                    boxShadow: '0 8px 25px rgba(255, 74, 0, 0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 74, 0, 0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 74, 0, 0.3)'; }}
                >
                  Add to Cart 🛒
                </button>
              );
            })()}
          </div>
        </div>

        {/* Specs Table */}
        {product.specs && (
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '2rem', marginTop: '3rem' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 800 }}>Technical Specifications</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {Object.entries(product.specs).map(([k, v]) => (
                <li key={k} style={{ background: '#f8f9fc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.2rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{k}</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 600 }}>{v}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Similar Products (Recommendations) */}
        {(() => {
          const recommendations = allProducts.filter(p => p.brand === product.brand && p.model !== product.model).slice(0, 8);
          if (recommendations.length === 0) return null;
          return (
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '2rem', marginTop: '3rem' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 800 }}>Similar Products from {product.brand}</h4>
              <div className="recommendations-slider" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}>
                {recommendations.map((rec, i) => (
                  <div key={i} onClick={() => window.location.hash = `#product/${encodeURIComponent(rec.model)}`} style={{ flex: '0 0 200px', scrollSnapAlign: 'start', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ background: '#f8f9fc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {rec.images && rec.images[0] ? (
                        <img src={rec.images[0]} alt={rec.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '2rem' }}>📷</span>
                      )}
                    </div>
                    <h5 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0 0 0.3rem', fontWeight: 700, lineHeight: 1.3 }}>{rec.name}</h5>
                    <p style={{ fontSize: '0.8rem', color: bc, fontWeight: 600, margin: '0 0 0.5rem' }}>{rec.model}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                        {rec.price ? `₹${rec.price.toLocaleString('en-IN')}` : 'Price on Request'}
                      </span>
                      {(() => {
                        const cartItem = cart.find(c => c.model === rec.model);
                        const qty = cartItem ? cartItem.quantity : 0;
                        return qty > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--accent-color)', borderRadius: '6px', padding: '0.15rem' }}>
                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(rec.model, qty - 1); }} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                            <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.85rem', margin: '0 0.4rem' }}>{qty}</span>
                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(rec.model, qty + 1); }} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', borderRadius: '6px' }}
                            onClick={(e) => { e.stopPropagation(); addToCart(rec); }}
                          >
                            Add 🛒
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
              <style>{`
                .recommendations-slider::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          );
        })()}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
