import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';

// ── TAB DEFINITIONS ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'cameras',     label: '📷 Cameras'           },
  { id: 'dvr',         label: '💾 DVR / XVR'          },
  { id: 'nvr',         label: '📼 NVR'                },
  { id: 'power',       label: '⚡ Power Supplies'     },
  { id: 'cables',      label: '🔌 Cables'             },
  { id: 'accessories', label: '🔧 Accessories'        },
  { id: 'services',    label: '🛠️ Services'           },
];

// ── BRANDS ──────────────────────────────────────────────────────────────────
const BRANDS = ['All', 'CP PLUS', 'Hikvision', 'Dahua', 'Axis', 'EZVIZ', 'TP-Link'];

// ── IMAGE MAP (unique per product type) ──────────────────────────────────────
const IMG = {
  // cameras – real downloaded images
  cpBullet:   '/images/cp-unc-ta41l3-d.jpg',
  cpDome:     '/images/cp-usc-da24l2.jpg',
  cpPtz:      '/images/cp-unp-d2521l10-daq.jpg',
  cpWifi:     '/images/cp-e35a.jpg',
  hikBullet:  '/images/hikvision-colorvu.jpg',
  hikDome:    '/images/hikvision-colorvu.jpg',
  dahuaTurret:'/images/dahua-wizsense.jpg',
  ezvizBullet:'/images/ezviz-c3w-pro.jpg',
  axisP3245:  '/images/axis-p3245-v.jpg',
  axisM3106:  '/images/axis-m3106-l.jpg',
  // solar & 4G SIM
  solar:      '/images/solar-camera.jpg',
  sim4g:      '/images/sim-camera.jpg',
  sdSim:      '/images/sd-sim-card.jpg',
  // recorders
  dvr:        '/images/dvr-recorder.jpg',
  nvr:        '/images/nvr-recorder.jpg',
  // power
  smps:       '/images/smps-power.jpg',
  // cables
  coax:       '/images/coax-cable.jpg',
  cat6:       '/images/cat6-cable.jpg',
  // accessories
  poeSwitch:  '/images/poe-switch.jpg',
  hdd:        '/images/hdd-drive.jpg',
  bnc:        '/images/bnc-connector.jpg',
  bracket:    '/images/wall-bracket.jpg',
  ups:        '/images/ups-backup.jpg',
  // services
  svcImg:     '/images/service-install.jpg',
};

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImgIdx,    setActiveImgIdx]    = useState(0);
  const [view360,         setView360]         = useState(false);
  const { cart, addToCart, updateQuantity } = useCart();

  // All products across every category flattened
  const allProducts = useMemo(() => Object.values(ALL_PRODUCTS).flat(), []);

  // Products for selected brand
  const brandProducts = useMemo(() => {
    if (!selectedBrand) return [];
    return allProducts.filter(p => p.brand === selectedBrand);
  }, [selectedBrand, allProducts]);

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
        {!selectedBrand && (
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
                    onClick={() => setSelectedBrand(brand)}
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




        {/* ── BRAND PRODUCTS VIEW ── */}

        {selectedBrand && (
          <>
            {/* back + header */}
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
              <button
                onClick={goBack}
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
                ← All Brands
              </button>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                <span style={{
                  width:'10px', height:'10px', borderRadius:'50%',
                  background: brandColors[selectedBrand] || '#ff4a00',
                  display:'inline-block',
                }} />
                <h3 style={{ color:'var(--text-primary)', fontSize:'1.2rem', fontWeight:800, margin:0 }}>
                  {selectedBrand}
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
                  <div key={idx} className="card"
                    style={{ background:'#fff', cursor:'pointer', display:'flex', flexDirection:'column', padding:'1.25rem' }}
                    onClick={() => openProduct(item)}>
                    {/* image */}
                    <div style={{ height:'155px', background:'#f8f9fc', borderRadius:'10px', overflow:'hidden', marginBottom:'0.9rem', border:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
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
                    {/* brand badge */}
                    <span style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.06em', padding:'0.18rem 0.55rem', borderRadius:'999px', background:`${col}15`, color:col, alignSelf:'flex-start', marginBottom:'0.5rem', border:`1px solid ${col}40` }}>
                      {item.brand}
                    </span>
                    <h3 style={{ fontSize:'0.93rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem', lineHeight:1.35 }}>{item.name}</h3>
                    <p style={{ fontSize:'0.76rem', color:col, fontWeight:600, marginBottom:'0.45rem' }}>{item.model}</p>
                    <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', flex:1, lineHeight:1.55 }}>{item.desc}</p>
                    {/* feature pills – first 3 */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.25rem', margin:'0.6rem 0' }}>
                      {item.tags.slice(0,3).map((t,ti) => (
                        <span key={ti} style={{ fontSize:'0.66rem', padding:'0.15rem 0.42rem', borderRadius:'999px', background:'#f3f4f6', color:'#6b7280', border:'1px solid #e5e7eb' }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '0.55rem', marginLeft: 0, fontSize: '0.82rem' }}
                        onClick={(e) => { e.stopPropagation(); openProduct(item); }}
                      >
                        Details
                      </button>
                      {(() => {
                        const cartItem = cart.find(c => c.model === item.model);
                        const qty = cartItem ? cartItem.quantity : 0;
                        return qty > 0 ? (
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff5f2', border: '1px solid var(--accent-color)', borderRadius: '8px', padding: '0.3rem 0.5rem' }}>
                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.model, qty - 1); }} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', padding: '0 0.5rem' }}>-</button>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '0.9rem' }}>{qty} added</span>
                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.model, qty + 1); }} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', padding: '0 0.5rem' }}>+</button>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-primary" 
                            style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}
                            onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                          >
                            Add 🛒
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeProduct}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize:'1.2rem', margin:0, color:'var(--text-primary)' }}>{selectedProduct.name}</h2>
              <button onClick={closeProduct} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              {/* hero */}
              <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', marginBottom:'1.75rem', alignItems:'flex-start' }}>
                <div style={{ flex:'0 0 300px', display:'flex', flexDirection:'column', gap:'1rem' }}>
                  
                  {/* Main Image or 360 Viewer */}
                  <div style={{ height:'300px', background:'#f8f9fc', borderRadius:'14px', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #e5e7eb', position:'relative' }}>
                    {view360 ? (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <span style={{ fontSize: '3rem' }}>🔄</span>
                        <h4 style={{ margin: '1rem 0 0.5rem', color: '#111827' }}>Interactive 360° View</h4>
                        <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Drag to rotate the product.<br/>(Placeholder for 360 assets)</p>
                      </div>
                    ) : (
                      <img src={selectedProduct.images ? selectedProduct.images[activeImgIdx] : ''} alt={selectedProduct.name}
                        style={{ width:'100%', height:'100%', objectFit:'contain', padding:'12px', position:'absolute', zIndex:2 }}
                        onError={e => { 
                          e.target.style.display='none'; 
                          if (e.target.parentNode.querySelector('.fallback-text')) return;
                          const span = document.createElement('span');
                          span.className = 'fallback-text';
                          span.style.cssText = 'color:#9ca3af; font-size:1.8rem; font-weight:800; font-family:Outfit,sans-serif; z-index:1; text-align:center; padding:10px;';
                          span.innerText = selectedProduct.brand + ' ' + (activeImgIdx > 0 ? `(Angle ${activeImgIdx+1})` : '');
                          e.target.parentNode.appendChild(span);
                        }} />
                    )}
                  </div>
                  
                  {/* Thumbnails */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.5rem' }}>
                      {selectedProduct.images.map((imgUrl, idx) => (
                        <div key={idx} 
                          onClick={() => { setActiveImgIdx(idx); setView360(false); }}
                          style={{
                            width: '60px', height: '60px', flexShrink: 0,
                            borderRadius: '8px', background: '#fff', border: activeImgIdx === idx && !view360 ? '2px solid var(--accent-color)' : '1px solid #e5e7eb',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                          }}>
                           <img src={imgUrl} style={{ width:'100%', height:'100%', objectFit:'contain', padding:'4px' }} onError={e => e.target.style.display='none'} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 360 Button */}
                  {selectedProduct.has360 && (
                    <button 
                      onClick={() => setView360(true)}
                      style={{
                        padding: '0.75rem', background: view360 ? '#111827' : '#f3f4f6', 
                        color: view360 ? '#fff' : '#111827', border: 'none', borderRadius: '8px', 
                        fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                      }}>
                      🔄 View in 360°
                    </button>
                  )}
                </div>

                <div style={{ flex:1, minWidth:'250px' }}>
                  {/* brand & type badges */}
                  <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.75rem' }}>
                    {[selectedProduct.brand, selectedProduct.type].map((lbl,li) => {
                      const bc = brandColors[selectedProduct.brand] || '#ff4a00';
                      return (
                        <span key={li} style={{ fontSize:'0.72rem', fontWeight:700, padding:'0.2rem 0.65rem', borderRadius:'999px',
                          background: li===0 ? `${bc}15` : '#f3f4f6',
                          color: li===0 ? bc : '#6b7280',
                          border: li===0 ? `1px solid ${bc}40` : '1px solid #e5e7eb'
                        }}>{lbl}</span>
                      );
                    })}
                  </div>
                  <p style={{ color: brandColors[selectedProduct.brand]||'#ff4a00', fontWeight:700, marginBottom:'0.5rem', fontSize:'0.9rem' }}>Model: {selectedProduct.model}</p>
                  <p style={{ color:'var(--text-secondary)', lineHeight:1.65, marginBottom:'0.9rem', fontSize:'0.9rem' }}>{selectedProduct.desc}</p>
                  {/* all tags */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem', marginBottom:'1rem' }}>
                    {selectedProduct.tags.map((t,ti) => (
                      <span key={ti} style={{ fontSize:'0.72rem', padding:'0.22rem 0.6rem', borderRadius:'999px', background:'#fff5f2', color:'var(--accent-color)', fontWeight:600, border:'1px solid rgba(255,74,0,0.18)' }}>{t}</span>
                    ))}
                  </div>
                  {selectedProduct.apps && (
                    <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1rem' }}>
                      <strong style={{ color:'var(--text-primary)' }}>Best For: </strong>{selectedProduct.apps}
                    </p>
                  )}
                  
                  {(() => {
                    const cartItem = cart.find(c => c.model === selectedProduct.model);
                    const qty = cartItem ? cartItem.quantity : 0;
                    return qty > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff5f2', border: '2px solid var(--accent-color)', borderRadius: '8px', padding: '0.6rem 1rem', marginTop: '1rem', width: '100%' }}>
                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(selectedProduct.model, qty - 1); }} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', padding: '0 1rem' }}>-</button>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1rem' }}>{qty} in cart</span>
                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(selectedProduct.model, qty + 1); }} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', padding: '0 1rem' }}>+</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { addToCart(selectedProduct); }}
                        style={{
                          background: 'var(--accent-color)', color: '#fff',
                          border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px',
                          fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem',
                          width: '100%', marginTop: '1rem',
                          boxShadow: '0 4px 14px rgba(255, 74, 0, 0.3)'
                        }}
                      >
                        Add to Cart 🛒
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* specs table */}
              {selectedProduct.specs && (
                <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:'1.4rem' }}>
                  <h4 style={{ color:'var(--text-primary)', marginBottom:'1rem', fontSize:'1rem', fontWeight:700 }}>Technical Specifications</h4>
                  <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'0.5rem' }}>
                    {Object.entries(selectedProduct.specs).map(([k,v]) => (
                      <li key={k} style={{ background:'#f8f9fc', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'0.65rem 0.9rem' }}>
                        <div style={{ fontSize:'0.67rem', color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.18rem' }}>{k}</div>
                        <div style={{ fontSize:'0.86rem', color:'var(--text-primary)', lineHeight:1.4, fontWeight:500 }}>{v}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;

