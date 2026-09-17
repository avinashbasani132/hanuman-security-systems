import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';

// ── BRANDS ──────────────────────────────────────────────────────────────────
const BRANDS = ['All', 'CP PLUS', 'Hikvision', 'Dahua', 'Axis', 'EZVIZ', 'TP-Link'];

// ── FULL PRODUCT DATA ────────────────────────────────────────────────────────
import ALL_PRODUCTS from '../data/products.json';
// ── BRAND META (logos / taglines shown on cards) ──────────────────────────────
const BRAND_META = {
  'CP PLUS':   { logo: '/images/logo-cpplus.svg',   tagline: 'India\'s #1 CCTV Brand',        color: '#e53935' },
  'Hikvision': { logo: '/images/logo-hikvision.svg', tagline: 'World Leader in Video Security', color: '#e53935' },
  'Dahua':     { logo: '/images/logo-dahua.svg',     tagline: 'WizSense AI Technology',         color: '#2e7d32' },
  'Axis':      { logo: '/images/logo-axis.svg',      tagline: 'Pioneer of Network Video',       color: '#6a1b9a' },
  'EZVIZ':     { logo: '/images/logo-ezviz.svg',     tagline: 'Smart Home Security',            color: '#e65100' },
  'TP-Link':   { logo: '/images/logo-tplink.svg',    tagline: 'VIGI – Reliable IP Cameras',     color: '#00bcd4' },
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const Products = () => {
  const [selectedBrand,   setSelectedBrand]   = useState(null);
  const { cart, updateQuantity, addToCart, toggleCart, searchQuery, setSearchQuery, allProducts } = useCart();



  // Products for selected brand or search query
  const brandProducts = useMemo(() => {
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return allProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.model && p.model.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q)) ||
        (p.tags && Array.isArray(p.tags) ? p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q)) : (typeof p.tags === 'string' && p.tags.toLowerCase().includes(q)))
      );
    }
    if (!selectedBrand) return [];
    return allProducts.filter(p => p.brand === selectedBrand);
  }, [selectedBrand, allProducts, searchQuery]);

  // Product count per brand (for showing on card)
  const brandCount = useMemo(() => {
    const counts = {};
    allProducts.forEach(p => { counts[p.brand] = (counts[p.brand] || 0) + 1; });
    return counts;
  }, [allProducts]);

  const openProduct  = (p) => { 
    setSelectedProduct(p); 
    setActiveImgIdx(0); 
    setView360(false);
    document.body.style.overflow = 'hidden'; 
  };
  const closeProduct = ()  => { setSelectedProduct(null); document.body.style.overflow = 'auto'; };
  const goBack       = ()  => { setSelectedBrand(null); };

  const brandColors = {
    'CP PLUS':   '#e53935',
    'Hikvision': '#1565c0',
    'Dahua':     '#2e7d32',
    'Axis':      '#6a1b9a',
    'EZVIZ':     '#e65100',
    'TP-Link':   '#00bcd4',
  };

  // The brands to show (only ones that have products)
  const activeBrands = BRANDS.filter(b => b !== 'All' && brandCount[b]);

  return (
    <section id="products" className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <h2 className="section-title">Products & <span>Services</span></h2>
        <p style={{ textAlign:'center', color:'var(--text-secondary)', marginBottom:'2.5rem', maxWidth:'640px', margin:'0 auto 2.5rem' }}>
          Complete CCTV solutions — we supply, install and service all major brands. Choose a brand below to explore its full product range.
        </p>

        {/* ── BRAND SELECTION VIEW ── */}
        {!selectedBrand && !searchQuery && (
          <>
            {/* brand grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '0.5rem',
            }}>
              {activeBrands.map(brand => {
                const meta  = BRAND_META[brand] || { logo: '', tagline: '', color: '#6366f1' };
                const col   = meta.color;
                const count = brandCount[brand] || 0;
                return (
                  <button
                    key={brand}
                    onClick={() => window.location.hash = `#brand/${encodeURIComponent(brand)}`}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '20px',
                      padding: '0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.13)`;
                      e.currentTarget.style.borderColor = col;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {/* logo display area */}
                    <div style={{
                      width: '100%',
                      height: '110px',
                      background: '#fafbfc',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.25rem 2rem',
                      boxSizing: 'border-box',
                    }}>
                      <img
                        src={meta.logo}
                        alt={brand}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '60px',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                        }}
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<span style="font-family:Outfit,sans-serif;font-size:1.6rem;font-weight:900;color:#111">${brand}</span>`;
                        }}
                      />
                    </div>

                    {/* card info */}
                    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                      <div>
                        <h3 style={{ color: '#111827', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 0.3rem', fontFamily: 'Outfit,sans-serif' }}>
                          {brand}
                        </h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.83rem', margin: 0, lineHeight: 1.4 }}>
                          {meta.tagline}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #f3f4f6',
                        marginTop: 'auto',
                      }}>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}>
                          <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: col, display:'inline-block' }} />
                          {count} products
                        </span>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: col,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          Explore all →
                        </span>
                      </div>
                    </div>

                    {/* colour accent bar */}
                    <div style={{ height: '4px', background: col, width: '100%', flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </>
        )}




        {/* ── BRAND PRODUCTS / SEARCH RESULTS VIEW ── */}
        {(selectedBrand || searchQuery) && (
          <>
            {/* back + header */}
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
              <button
                onClick={() => { goBack(); if (setSearchQuery) setSearchQuery(''); }}
                style={{
                  padding:'0.65rem 1.4rem', borderRadius:'999px',
                  border:'1.5px solid #e5e7eb',
                  background:'#fff',
                  color:'var(--text-secondary)', cursor:'pointer',
                  fontSize:'0.95rem', fontWeight: '600', transition:'all 0.2s',
                  boxShadow:'0 1px 4px rgba(0,0,0,0.07)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color=brandColors[selectedBrand]||'#ff4a00'; e.currentTarget.style.borderColor=brandColors[selectedBrand]||'#ff4a00'; }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.borderColor='#e5e7eb'; }}
              >
                ← {searchQuery ? 'Clear Search' : 'All Brands'}
              </button>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                {!searchQuery && (
                  <span style={{
                    width:'10px', height:'10px', borderRadius:'50%',
                    background: brandColors[selectedBrand] || '#ff4a00',
                    display:'inline-block',
                  }} />
                )}
                <h3 style={{ color:'var(--text-primary)', fontSize:'1.2rem', fontWeight:800, margin:0 }}>
                  {searchQuery ? `Search Results for "${searchQuery}"` : selectedBrand}
                  <span style={{ color:'var(--text-secondary)', fontWeight:400, fontSize:'0.9rem', marginLeft:'0.5rem' }}>
                    — {brandProducts.length} products
                  </span>
                </h3>
              </div>
            </div>

            {/* product grid */}
            <div className="grid grid-3">
              {brandProducts.map((item, idx) => {
                const col = brandColors[item.brand] || '#6366f1';
                return (
                  <div key={idx} className="card product-card-responsive" onClick={() => window.location.hash = `#product/${encodeURIComponent(item.model)}`}>
                    {/* image */}
                    <div className="product-image-container" style={{ background:'#f8f9fc', borderRadius:'10px', overflow:'hidden', border:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', flexShrink: 0 }}>
                      <img src={item.images[0]} alt={item.name}
                        style={{ width:'100%', height:'100%', objectFit:'contain', padding:'10px', position:'absolute', zIndex:2 }}
                        onError={e => { 
                          e.target.style.display='none'; 
                          if (e.target.parentNode.querySelector('.fallback-text')) return;
                          const span = document.createElement('span');
                          span.className = 'fallback-text';
                          span.style.cssText = 'color:#9ca3af; font-size:1.5rem; font-weight:800; font-family:Outfit,sans-serif; z-index:1;';
                          span.innerText = item.brand;
                          e.target.parentNode.appendChild(span);
                        }} />
                    </div>
                    
                    {/* info */}
                    <div className="product-info-container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* brand badge */}
                      <span style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.06em', padding:'0.18rem 0.55rem', borderRadius:'999px', background:`${col}15`, color:col, alignSelf:'flex-start', marginBottom:'0.5rem', border:`1px solid ${col}40` }}>
                        {item.brand}
                      </span>
                      <h3 className="product-card-title" style={{ fontSize:'0.93rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem', lineHeight:1.35 }}>{item.name}</h3>
                      <p style={{ fontSize:'0.76rem', color:col, fontWeight:600, marginBottom:'0.45rem' }}>{item.model}</p>
                      <p className="product-card-desc" style={{ fontSize:'0.82rem', color:'var(--text-secondary)', flex:1, lineHeight:1.55 }}>{item.desc}</p>
                      {/* feature pills – first 3 */}
                      <div className="product-card-tags" style={{ display:'flex', flexWrap:'wrap', gap:'0.25rem', margin:'0.6rem 0' }}>
                        {(Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : [])).slice(0,3).map((t,ti) => (
                          <span key={ti} style={{ fontSize:'0.66rem', padding:'0.15rem 0.42rem', borderRadius:'999px', background:'#f3f4f6', color:'#6b7280', border:'1px solid #e5e7eb' }}>{t}</span>
                        ))}
                      </div>

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
          </>
        )}
      </div>
    </section>
  );
};

export default Products;

