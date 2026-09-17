import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses'
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoadingOrders(true);
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`user_email.eq.${user.email},user_phone.eq.${user.phone}`)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch from Supabase, checking local storage:", err);
        // Fallback to local storage if Supabase fails
        const localOrders = JSON.parse(localStorage.getItem('cctv_local_orders') || '[]');
        const userOrders = localOrders
          .filter(order => order.user_email === user.email || order.user_phone === user.phone)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setOrders(userOrders);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchAddresses = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id);
        
        if (!error && data) {
          setAddresses(data);
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };

    if (!authLoading) {
      if (user) {
        fetchOrders();
        fetchAddresses();
      } else {
        setLoadingOrders(false);
      }
    }
  }, [user, authLoading]);

  const handleDeleteAddress = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this address?");
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (!error) {
        setAddresses(addresses.filter(a => a.id !== id));
      } else {
        alert("Failed to delete address. Check database policies.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loadingOrders) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', background: '#f8f9fc' }}>
        <div style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 600 }}>Loading your account...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', background: '#f8f9fc' }}>
        <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</span>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.5rem' }}>Please Log In</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>You need to be logged in to view your account.</p>
        <a href="#home" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Return Home</a>
      </div>
    );
  }

  const accentColor = '#ff4a00';

  return (
    <section style={{ background: '#f8f9fc', minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit, sans-serif', margin: '0 0 0.5rem 0' }}>
              My Account
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
              Welcome back, <strong style={{ color: '#111827' }}>{user.phone || user.email}</strong>
            </p>
          </div>
          <a href="#home" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, background: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '1.2rem' }}>←</span> Back to Shopping
          </a>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              background: 'none', border: 'none', padding: '1rem 1.5rem',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              color: activeTab === 'orders' ? accentColor : '#64748b',
              borderBottom: activeTab === 'orders' ? `3px solid ${accentColor}` : '3px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s'
            }}
          >
            📦 My Orders
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            style={{
              background: 'none', border: 'none', padding: '1rem 1.5rem',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              color: activeTab === 'addresses' ? accentColor : '#64748b',
              borderBottom: activeTab === 'addresses' ? `3px solid ${accentColor}` : '3px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s'
            }}
          >
            📍 Saved Addresses
          </button>
        </div>

        {/* TAB CONTENT: ORDERS */}
        {activeTab === 'orders' && (
          orders.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
              <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.5rem' }}>No orders yet</h3>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Looks like you haven't placed any orders with this account.</p>
              <a href="#products" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Start Shopping</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map((order, idx) => {
                const orderTotal = order.items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
                const date = new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                return (
                  <div key={order.id || idx} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                    {/* Order Header */}
                    <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>Order Placed</div>
                          <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>{date}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>Total Amount</div>
                          <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>₹{orderTotal.toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>Shipped To</div>
                          <div style={{ fontSize: '0.95rem', color: '#ea580c', fontWeight: 600 }}>{order.customer_name}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                        Order #{order.id ? String(order.id).slice(-6) : 'N/A'}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '60px', height: '60px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem' }}>
                              {item.images && item.images[0] ? (
                                <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <span style={{ fontSize: '1.5rem' }}>📷</span>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                                <span style={{ color: '#ea580c', fontWeight: 600 }}>{item.brand}</span> | {item.model}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}</div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qty: {item.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Delivery Address */}
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed #e5e7eb' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>Delivery Address</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                          {order.address}<br />
                          Phone: {order.contact_no}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* TAB CONTENT: ADDRESSES */}
        {activeTab === 'addresses' && (
          addresses.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>📍</span>
              <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.5rem' }}>No saved addresses</h3>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Addresses you add during checkout will be saved here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {addresses.map(addr => (
                <div key={addr.id} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0f172a' }}>{addr.name}</h4>
                  <div style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6 }}>
                    {addr.address}<br/>
                    {addr.landmark && <>{addr.landmark}<br/></>}
                    {addr.city}, {addr.pincode}<br/>
                    <strong>Phone:</strong> {addr.phone}
                  </div>
                  <button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </section>
  );
};

export default MyOrders;
