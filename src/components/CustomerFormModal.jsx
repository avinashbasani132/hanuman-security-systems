import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const brandColors = {
  'CP PLUS':   '#e53935',
  'Hikvision': '#1565c0',
  'Dahua':     '#2e7d32',
  'Axis':      '#6a1b9a',
  'EZVIZ':     '#e65100',
  'TP-Link':   '#00bcd4',
};

const Field = ({ label, id, type = 'text', value, onChange, placeholder, required, error }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
    <label htmlFor={id} style={{
      fontSize: '0.78rem', fontWeight: 700, color: '#374151',
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
        fontSize: '0.9rem',
        outline: 'none',
        background: error ? '#fef2f2' : '#fafbfc',
        color: '#111827',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
        fontFamily: 'Outfit, sans-serif',
        width: '100%',
        boxSizing: 'border-box',
      }}
      onFocus={e => {
        if (!error) {
          e.target.style.borderColor = '#ff4a00';
          e.target.style.boxShadow = '0 0 0 3px rgba(255,74,0,0.12)';
          e.target.style.background = '#fff';
        }
      }}
      onBlur={e => {
        if (!error) {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.boxShadow = 'none';
          e.target.style.background = '#fafbfc';
        }
      }}
    />
    {error && (
      <span style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 600 }}>
        ⚠ {error}
      </span>
    )}
  </div>
);

const CustomerFormModal = () => {
  const {
    showCustomerForm, setShowCustomerForm,
    pendingProduct,
    customerDetails, setCustomerDetails,
    confirmAddToCart,
  } = useCart();

  const [errors, setErrors]   = useState({});
  const [shake, setShake]     = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (showCustomerForm) {
      setSuccess(false);
      setErrors({});
    }
  }, [showCustomerForm]);

  if (!showCustomerForm || !pendingProduct) return null;

  const accentColor = brandColors[pendingProduct.brand] || '#ff4a00';

  const handleChange = (field) => (e) => {
    setCustomerDetails(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!customerDetails.name.trim())    newErrors.name    = 'Full name is required';
    if (!customerDetails.phone.trim())   newErrors.phone   = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(customerDetails.phone.replace(/\s/g, '')))
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!customerDetails.address.trim()) newErrors.address = 'Address is required';
    if (!customerDetails.city.trim())    newErrors.city    = 'City is required';
    if (!customerDetails.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(customerDetails.pincode.trim()))
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      confirmAddToCart();
    }, 900);
  };

  const close = () => {
    setShowCustomerForm(false);
    setErrors({});
  };

  const productImage = pendingProduct.images?.[0] || '';

  return (
    <>
      <style>{`
        @keyframes cfmSlideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cfmShake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-5px); }
          80%     { transform: translateX(5px); }
        }
        @keyframes cfmSuccessPop {
          0%  { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.15); }
          100%{ transform: scale(1);   opacity: 1; }
        }
        .cfm-box { animation: cfmSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1); }
        .cfm-shake { animation: cfmShake 0.45s ease; }
        .cfm-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 0;
        }
        @media (max-width: 820px) {
          .cfm-grid { grid-template-columns: 1fr; }
          .cfm-summary { border-top: 1px solid #f0f0f0 !important; border-left: none !important; }
        }
        .cfm-submit-btn:hover {
          transform: translateY(-2px);
        }
        /* Mobile: collapse 2-col input rows to 1 col */
        @media (max-width: 520px) {
          .cfm-row-2 { grid-template-columns: 1fr !important; }
          .cfm-row-3 { grid-template-columns: 1fr !important; }
          .cfm-box   { border-radius: 16px 16px 0 0 !important; }
        }
      `}</style>

      {/* OVERLAY */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        {/* MODAL BOX */}
        <div
          className="cfm-box"
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '860px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
            overflow: 'hidden',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* TOP HEADER */}
          <div style={{
            padding: '1.25rem 1.75rem',
            background: `linear-gradient(135deg, ${accentColor}12 0%, #fff 100%)`,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '11px',
                background: `${accentColor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem',
              }}>📋</div>
              <div>
                <h2 style={{
                  margin: 0, fontSize: '1.1rem', fontWeight: 800,
                  color: '#0f172a', fontFamily: 'Outfit, sans-serif',
                }}>
                  Complete Your Order Request
                </h2>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  We'll contact you within 24 hours to confirm your installation
                </p>
              </div>
            </div>
            <button
              onClick={close}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: '1.5px solid #e5e7eb', background: '#fff',
                cursor: 'pointer', fontSize: '1.1rem', color: '#6b7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, lineHeight: 1,
              }}
            >×</button>
          </div>

          {/* BODY */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div className="cfm-grid">

              {/* ── FORM PANEL ── */}
              <div
                className={shake ? 'cfm-shake' : ''}
                style={{ padding: '2rem', borderRight: '1px solid #f0f0f0' }}
              >
                {success ? (
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', padding: '3rem 1rem', gap: '1rem',
                  }}>
                    <div style={{ fontSize: '4rem', animation: 'cfmSuccessPop 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
                      ✅
                    </div>
                    <h3 style={{
                      fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem',
                      fontWeight: 800, color: '#0f172a', margin: 0,
                    }}>
                      Added to Cart Successfully!
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0, maxWidth: '300px', lineHeight: 1.6 }}>
                      Our team will call <strong>{customerDetails.phone}</strong> to confirm your installation appointment.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <h3 style={{
                      fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 800,
                      color: '#0f172a', margin: '0 0 1.5rem',
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                    }}>
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: `${accentColor}15`, color: accentColor,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 900,
                      }}>1</span>
                      Delivery &amp; Contact Details
                    </h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {/* Row 1 */}
                      <div className="cfm-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Field label="Full Name"      id="cfm-name"   value={customerDetails.name}   onChange={handleChange('name')}   placeholder="e.g. Ravi Kumar"    required error={errors.name} />
                        <Field label="Mobile Number"  id="cfm-phone"  type="tel" value={customerDetails.phone}  onChange={handleChange('phone')}  placeholder="e.g. 9876543210"    required error={errors.phone} />
                      </div>

                      {/* Email */}
                      <Field label="Email Address (Optional)" id="cfm-email" type="email" value={customerDetails.email} onChange={handleChange('email')} placeholder="e.g. ravi@email.com" error={errors.email} />

                      {/* Address */}
                      <Field label="Full Address"  id="cfm-address"  value={customerDetails.address}  onChange={handleChange('address')}  placeholder="House no., Street, Area, Colony..." required error={errors.address} />

                      {/* Row 3 */}
                      <div className="cfm-row-3" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <Field label="City / Town" id="cfm-city"    value={customerDetails.city}    onChange={handleChange('city')}    placeholder="e.g. Hyderabad" required error={errors.city} />
                        <Field label="Pincode"     id="cfm-pincode" value={customerDetails.pincode} onChange={handleChange('pincode')} placeholder="6 digits"       required error={errors.pincode} />
                      </div>

                      {/* Landmark */}
                      <Field label="Landmark (Optional)" id="cfm-landmark" value={customerDetails.landmark} onChange={handleChange('landmark')} placeholder="Near SBI Bank / Beside temple..." error={errors.landmark} />
                    </div>

                    {/* Privacy note */}
                    <div style={{
                      marginTop: '1.4rem', padding: '0.85rem 1rem',
                      background: '#f0fdf4', border: '1px solid #bbf7d0',
                      borderRadius: '10px', fontSize: '0.77rem', color: '#166534',
                      display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                    }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>🔒</span>
                      Your details are safe with us — used only to confirm your installation appointment. No spam, ever.
                    </div>

                    {/* CTA */}
                    <button
                      type="submit"
                      className="cfm-submit-btn"
                      style={{
                        width: '100%', marginTop: '1.25rem',
                        padding: '1rem 1.5rem',
                        background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                        color: '#fff', border: 'none', borderRadius: '12px',
                        fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                        boxShadow: `0 6px 20px ${accentColor}40`,
                        fontFamily: 'Outfit, sans-serif',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        letterSpacing: '0.01em',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 12px 30px ${accentColor}55`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 6px 20px ${accentColor}40`;
                      }}
                    >
                      Confirm &amp; Add to Cart 🛒
                    </button>
                  </form>
                )}
              </div>

              {/* ── SUMMARY PANEL ── */}
              <div
                className="cfm-summary"
                style={{
                  padding: '2rem 1.5rem',
                  background: '#fafbfc',
                  display: 'flex', flexDirection: 'column', gap: '1.25rem',
                }}
              >
                <h3 style={{
                  margin: 0, fontSize: '0.78rem', fontWeight: 800,
                  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  Order Summary
                </h3>

                {/* Product card */}
                <div style={{
                  background: '#fff',
                  border: `1.5px solid ${accentColor}35`,
                  borderRadius: '14px', overflow: 'hidden',
                  boxShadow: `0 4px 16px ${accentColor}12`,
                }}>
                  <div style={{
                    height: '150px', background: '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={productImage}
                      alt={pendingProduct.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                      onError={e => {
                        e.target.style.display = 'none';
                        if (!e.target.parentNode.querySelector('.cfm-img-fallback')) {
                          const s = document.createElement('span');
                          s.className = 'cfm-img-fallback';
                          s.style.cssText = 'font-size:1.5rem;font-weight:900;color:#9ca3af;font-family:Outfit,sans-serif;';
                          s.innerText = pendingProduct.brand;
                          e.target.parentNode.appendChild(s);
                        }
                      }}
                    />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em',
                      padding: '0.15rem 0.55rem', borderRadius: '999px',
                      background: `${accentColor}15`, color: accentColor,
                      border: `1px solid ${accentColor}40`,
                    }}>{pendingProduct.brand}</span>
                    <h4 style={{
                      margin: '0.6rem 0 0.2rem', fontSize: '0.88rem', fontWeight: 800,
                      color: '#0f172a', lineHeight: 1.35, fontFamily: 'Outfit, sans-serif',
                    }}>{pendingProduct.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: accentColor, fontWeight: 600 }}>
                      Model: {pendingProduct.model}
                    </p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.76rem', color: '#64748b', lineHeight: 1.5 }}>
                      {pendingProduct.desc?.slice(0, 95)}{(pendingProduct.desc?.length || 0) > 95 ? '…' : ''}
                    </p>
                  </div>
                </div>

                {/* Free survey badge */}
                <div style={{
                  background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                  border: '1px solid #fed7aa', borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                }}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🎁</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.79rem', fontWeight: 800, color: '#c2410c' }}>
                      Free Site Survey Included
                    </p>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: '#9a3412', lineHeight: 1.5 }}>
                      Technician visits your site before installation — at no extra cost.
                    </p>
                  </div>
                </div>

                {/* Assurances */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {[
                    { icon: '⚡', text: 'Response within 24 hours' },
                    { icon: '🛡️', text: 'Warranty on all installations' },
                    { icon: '📍', text: 'Hyderabad & surrounding areas' },
                    { icon: '📞', text: '24/7 support after installation' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.55rem',
                      fontSize: '0.78rem', color: '#374151', fontWeight: 500,
                    }}>
                      <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerFormModal;
