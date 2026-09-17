import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

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

const CheckoutModal = () => {
  const {
    showCheckoutForm, setShowCheckoutForm,
    cart, clearCart,
    customerDetails, setCustomerDetails,
  } = useCart();
  const { user } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState('address'); // 'address' | 'review'
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [errors, setErrors]   = useState({});
  const [shake, setShake]     = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showCheckoutForm) {
      setSuccess(false);
      setErrors({});
      setCheckoutStep('address');
      document.body.style.overflow = 'hidden';

      // Load saved addresses for user
      if (user) {
        const fetchAddresses = async () => {
          const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user.id);
            
          if (!error && data) {
            setSavedAddresses(data);
            if (data.length > 0) {
              setIsAddingNew(false);
              setSelectedAddressId(data[0].id);
            } else {
              setIsAddingNew(true);
            }
          } else {
            setIsAddingNew(true);
          }
        };
        fetchAddresses();
      } else {
        setIsAddingNew(true);
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCheckoutForm, user]);

  if (!showCheckoutForm) return null;

  const accentColor = '#ff4a00';
  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  const handleChange = (field) => (e) => {
    setCustomerDetails(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateAddress = () => {
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

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (isAddingNew) {
      const newErrors = validateAddress();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
      
      const newAddr = { 
        ...customerDetails, 
        user_id: user?.id, 
        user_phone: user?.phone, 
        user_email: user?.email 
      };
      
      const { data, error } = await supabase
        .from('addresses')
        .insert([newAddr])
        .select();

      if (!error && data && data.length > 0) {
        setSavedAddresses([...savedAddresses, data[0]]);
        setSelectedAddressId(data[0].id);
        setIsAddingNew(false);
      } else {
        console.error("Error saving address", error);
        alert("Failed to save address. Check database policies.");
        return;
      }
    } else {
      // User selected an existing address
      const selected = savedAddresses.find(a => a.id === selectedAddressId);
      if (selected) {
        setCustomerDetails({
          name: selected.name,
          phone: selected.phone,
          email: selected.email || '',
          address: selected.address,
          landmark: selected.landmark || '',
          city: selected.city,
          pincode: selected.pincode
        });
      }
    }
    
    // Proceed to review step
    setCheckoutStep('review');
  };

  const handleFinalSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase orders table
      const { error } = await supabase
        .from('orders')
        .insert([
          { 
            customer_name: customerDetails.name, 
            contact_no: customerDetails.phone, 
            address: `${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}`, 
            items: cart,
            user_email: user?.email || null,
            user_phone: user?.phone || null
          }
        ]);

      if (error) {
        console.error("Error saving order to DB, saving locally instead:", error);
        const localOrders = JSON.parse(localStorage.getItem('cctv_local_orders') || '[]');
        localOrders.push({
          id: Date.now(),
          created_at: new Date().toISOString(),
          customer_name: customerDetails.name,
          contact_no: customerDetails.phone,
          address: `${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}`,
          items: cart,
          user_email: user?.email || null,
          user_phone: user?.phone || null
        });
        localStorage.setItem('cctv_local_orders', JSON.stringify(localOrders));
      }

      // 2. Open WhatsApp with pre-filled text
      const targetPhone = "919014612983"; // Target WhatsApp Number
      
      let message = `*NEW ORDER* from Hanuman Enterprises Website\n\n`;
      message += `*Customer Details:*\n`;
      message += `Name: ${customerDetails.name}\n`;
      message += `Contact No: ${customerDetails.phone}\n`;
      if (customerDetails.email) message += `Email: ${customerDetails.email}\n`;
      message += `Address: ${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}\n`;
      if (customerDetails.landmark) message += `Landmark: ${customerDetails.landmark}\n`;
      message += `\n*Order Summary:*\n`;
      
      cart.forEach(item => {
        const itemTotal = (item.price || 0) * item.quantity;
        message += `- ${item.brand} ${item.model} (Qty: ${item.quantity}) - ₹${itemTotal.toLocaleString('en-IN')}\n`;
      });
      message += `\n*Total Amount:* ₹${cartTotal.toLocaleString('en-IN')}`;
      
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
      
      setSuccess(true);
      clearCart();
      
      // Delay before redirecting to WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setShowCheckoutForm(false);
      }, 2000);

    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
        }
        .modal-overlay {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .modal-box {
          animation: slideInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .modal-box.shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .address-card {
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafbfc;
        }
        .address-card:hover {
          border-color: ${accentColor}80;
        }
        .address-card.selected {
          border-color: ${accentColor};
          background: ${accentColor}0a;
          box-shadow: 0 4px 12px ${accentColor}1a;
        }
      `}</style>

      {/* OVERLAY */}
      <div className="modal-overlay" onClick={() => !isSubmitting && setShowCheckoutForm(false)} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
        zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}>
        
        {/* MODAL CONTAINER */}
        <div className={`modal-box ${shake ? 'shake' : ''}`} onClick={e => e.stopPropagation()} style={{
          background: '#fff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          overflow: 'hidden'
        }}>
          
          {/* HEADER */}
          <div style={{
            padding: '1.25rem 2rem',
            background: `linear-gradient(135deg, ${accentColor}10 0%, #fff 100%)`,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${accentColor}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                {checkoutStep === 'address' ? '📍' : '🛒'}
              </div>
              <div>
                <h2 style={{
                  margin: 0, fontSize: '1.3rem', fontWeight: 800,
                  color: '#0f172a', fontFamily: 'Outfit, sans-serif'
                }}>
                  {checkoutStep === 'address' ? 'Delivery Address' : 'Review & Checkout'}
                </h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                  {checkoutStep === 'address' ? 'Choose where you want your items delivered' : 'Confirm your order details'}
                </p>
              </div>
            </div>
            {!isSubmitting && (
              <button
                onClick={() => setShowCheckoutForm(false)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1.5px solid #e5e7eb', background: '#fff',
                  cursor: 'pointer', fontSize: '1.2rem', color: '#6b7280',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >×</button>
            )}
          </div>

          {success ? (
            /* SUCCESS VIEW */
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Order Placed!</h2>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>Opening WhatsApp to finalize your order...</p>
            </div>
          ) : (
            /* SCROLLABLE CONTENT AREA */
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              
              {checkoutStep === 'address' && (
                <form id="addressForm" onSubmit={handleAddressSubmit}>
                  
                  {/* EXISTING ADDRESSES */}
                  {!isAddingNew && savedAddresses.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '1rem' }}>Your Saved Addresses</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {savedAddresses.map(addr => (
                          <div 
                            key={addr.id} 
                            className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                            onClick={() => setSelectedAddressId(addr.id)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <strong style={{ color: '#111827' }}>{addr.name}</strong>
                              {selectedAddressId === addr.id && <span style={{ color: accentColor }}>✓</span>}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>
                              {addr.address}<br/>
                              {addr.city}, {addr.pincode}<br/>
                              Phone: {addr.phone}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setIsAddingNew(true)} style={{ background: 'none', border: 'none', color: accentColor, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                          + Add a new address
                        </button>
                      </div>
                    </div>
                  )}

                  {/* NEW ADDRESS FORM */}
                  {isAddingNew && (
                    <div>
                      {savedAddresses.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <button type="button" onClick={() => setIsAddingNew(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                            ← Back to saved addresses
                          </button>
                        </div>
                      )}
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '1rem' }}>Add New Address</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                        <Field label="Full Name" id="name" value={customerDetails.name} onChange={handleChange('name')} placeholder="e.g. Rahul Kumar" required error={errors.name} />
                        <Field label="Mobile Number" id="phone" type="tel" value={customerDetails.phone} onChange={handleChange('phone')} placeholder="10-digit number" required error={errors.phone} />
                        <div style={{ gridColumn: '1 / -1' }}>
                          <Field label="Complete Address" id="address" value={customerDetails.address} onChange={handleChange('address')} placeholder="House/Flat No, Street, Area" required error={errors.address} />
                        </div>
                        <Field label="City / Town" id="city" value={customerDetails.city} onChange={handleChange('city')} placeholder="e.g. Hyderabad" required error={errors.city} />
                        <Field label="Pincode" id="pincode" type="text" value={customerDetails.pincode} onChange={handleChange('pincode')} placeholder="e.g. 500001" required error={errors.pincode} />
                        <Field label="Email Address (Optional)" id="email" type="email" value={customerDetails.email} onChange={handleChange('email')} placeholder="For order updates" />
                        <Field label="Landmark (Optional)" id="landmark" value={customerDetails.landmark} onChange={handleChange('landmark')} placeholder="e.g. Near Apollo Hospital" />
                      </div>
                    </div>
                  )}
                </form>
              )}

              {checkoutStep === 'review' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Delivery Address Summary */}
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', background: '#fafbfc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Delivery Address</h3>
                      <button onClick={() => setCheckoutStep('address')} style={{ background: 'none', border: 'none', color: accentColor, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                        Change
                      </button>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#111827', lineHeight: 1.5 }}>
                      <strong>{customerDetails.name}</strong><br/>
                      {customerDetails.address}, {customerDetails.city} - {customerDetails.pincode}<br/>
                      Mobile: {customerDetails.phone}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Order Summary</h3>
                    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                      {cart.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: idx < cart.length - 1 ? '1px dashed #e5e7eb' : 'none' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', padding: '0.2rem' }}>
                              {item.images && item.images[0] ? (
                                <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : '📷'}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{item.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, color: '#111827' }}>
                            ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#374151' }}>Total Amount</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: accentColor }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* FOOTER ACTIONS */}
          {!success && (
            <div style={{
              padding: '1.25rem 2rem',
              background: '#f8fafc',
              borderTop: '1px solid #e5e7eb',
              display: 'flex', justifyContent: 'flex-end', gap: '1rem',
              flexShrink: 0
            }}>
              <button
                type="button"
                onClick={() => {
                  if (checkoutStep === 'review') setCheckoutStep('address');
                  else setShowCheckoutForm(false);
                }}
                disabled={isSubmitting}
                style={{
                  padding: '0.75rem 1.5rem', background: 'transparent',
                  color: '#64748b', border: 'none', fontWeight: 700, fontSize: '0.95rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif'
                }}
              >
                {checkoutStep === 'review' ? 'Back' : 'Cancel'}
              </button>
              
              {checkoutStep === 'address' ? (
                <button
                  type="submit"
                  form="addressForm"
                  style={{
                    padding: '0.85rem 2rem',
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                    color: '#fff', border: 'none', borderRadius: '12px',
                    fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                    boxShadow: `0 6px 20px ${accentColor}40`,
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  Deliver to this Address
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  style={{
                    padding: '0.85rem 2rem',
                    background: isSubmitting ? '#94a3b8' : '#22c55e', // Green for WhatsApp checkout
                    color: '#fff', border: 'none', borderRadius: '12px',
                    fontWeight: 800, fontSize: '0.95rem', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: isSubmitting ? 'none' : '0 6px 20px rgba(34,197,94,0.3)',
                    fontFamily: 'Outfit, sans-serif',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}
                >
                  {isSubmitting ? 'Processing...' : (
                    <>Confirm Order <span style={{ fontSize: '1.2rem' }}>💬</span></>
                  )}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </>,
    document.body
  );
};

export default CheckoutModal;
