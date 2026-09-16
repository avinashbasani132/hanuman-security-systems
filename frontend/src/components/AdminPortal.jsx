import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // Add Product State
  const [newProduct, setNewProduct] = useState({
    brand: '',
    model: '',
    name: '',
    desc: '',
    type: 'Bullet',
    tags: '',
    image: '',
    price: ''
  });
  const [addProductStatus, setAddProductStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    let supabaseOrders = [];
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) supabaseOrders = data;
    } catch (err) {
      console.error("Failed to fetch orders from Supabase:", err);
    }

    try {
      // Merge with local orders fallback
      const localOrders = JSON.parse(localStorage.getItem('cctv_local_orders') || '[]');
      const allOrders = [...localOrders, ...supabaseOrders];
      
      // Sort all combined orders by date descending
      allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setOrders(allOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    try {
      const savedProducts = JSON.parse(localStorage.getItem('cctv_custom_products') || '[]');
      
      const productToSave = {
        ...newProduct,
        price: newProduct.price ? Number(newProduct.price) : 0,
        tags: newProduct.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: newProduct.image ? [newProduct.image] : [],
        has360: false,
        specs: {
          Resolution: "N/A",
          Type: newProduct.type,
          Lens: "N/A"
        }
      };

      savedProducts.push(productToSave);
      localStorage.setItem('cctv_custom_products', JSON.stringify(savedProducts));
      
      setAddProductStatus('Product added successfully!');
      setNewProduct({ brand: '', model: '', name: '', desc: '', type: 'Bullet', tags: '', image: '', price: '' });
      
      setTimeout(() => setAddProductStatus(''), 3000);
    } catch (err) {
      setAddProductStatus('Error adding product.');
    }
  };

  const totalServices = orders.length;
  const totalProductsSold = orders.reduce((total, order) => {
    if (!order.items) return total;
    return total + order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, 0);

  return (
    <div className="admin-portal" style={{ minHeight: '100vh', background: '#f4f5f7', display: 'flex' }}>
      {/* SIDEBAR */}
      <div className="admin-sidebar" style={{ width: '260px', background: '#111827', color: '#fff', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '2.5rem', paddingLeft: '1rem' }}>
          Hanuman <span style={{ color: '#ff4a00' }}>Admin</span>
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              background: activeTab === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent', 
              border: 'none', color: '#fff', padding: '1rem', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s'
            }}>
            📊 Sales & Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ 
              background: activeTab === 'products' ? 'rgba(255,255,255,0.1)' : 'transparent', 
              border: 'none', color: '#fff', padding: '1rem', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s'
            }}>
            📦 Add Product
          </button>
          <button 
            onClick={() => window.location.hash = ''}
            style={{ 
              background: 'transparent', border: 'none', color: '#9ca3af', padding: '1rem', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginTop: 'auto'
            }}>
            ← Back to Website
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main" style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard</h1>
            
            {/* STATS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Services / Orders</p>
                <h3 style={{ fontSize: '2.5rem', color: '#111827', margin: 0 }}>{loadingOrders ? '...' : totalServices}</h3>
              </div>
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Products Requested</p>
                <h3 style={{ fontSize: '2.5rem', color: '#111827', margin: 0 }}>{loadingOrders ? '...' : totalProductsSold}</h3>
              </div>
            </div>

            {/* ORDERS TABLE */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Recent Orders</h3>
                <button onClick={fetchOrders} style={{ background: '#f3f4f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Refresh</button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '1rem 2rem', color: '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>Date</th>
                      <th style={{ padding: '1rem 2rem', color: '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>Customer</th>
                      <th style={{ padding: '1rem 2rem', color: '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>Contact</th>
                      <th style={{ padding: '1rem 2rem', color: '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>Address</th>
                      <th style={{ padding: '1rem 2rem', color: '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingOrders ? (
                      <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading orders...</td></tr>
                    ) : orders.length === 0 ? (
                      <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No orders found.</td></tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '1.25rem 2rem', color: '#374151', fontSize: '0.9rem' }}>
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1.25rem 2rem', color: '#111827', fontWeight: 600, fontSize: '0.9rem' }}>
                            {order.customer_name}
                          </td>
                          <td style={{ padding: '1.25rem 2rem', color: '#374151', fontSize: '0.9rem' }}>
                            {order.contact_no}
                          </td>
                          <td style={{ padding: '1.25rem 2rem', color: '#374151', fontSize: '0.9rem', maxWidth: '200px', minWidth: '150px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            {order.address}
                          </td>
                          <td style={{ padding: '1.25rem 2rem', color: '#374151', fontSize: '0.9rem' }}>
                            {order.items?.map(item => (
                              <div key={item.model} style={{ marginBottom: '0.25rem' }}>
                                <strong>{item.quantity}x</strong> {item.brand} {item.model}
                              </div>
                            ))}
                            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #e5e7eb', fontWeight: 800, color: '#111827' }}>
                              Total: ₹{order.items?.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0).toLocaleString('en-IN') || 0}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Add New Product</h1>
            
            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              {addProductStatus && (
                <div style={{ padding: '1rem', background: addProductStatus.includes('Error') ? '#fee2e2' : '#dcfce7', color: addProductStatus.includes('Error') ? '#ef4444' : '#16a34a', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
                  {addProductStatus}
                </div>
              )}
              
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Brand</label>
                  <select 
                    required
                    value={newProduct.brand}
                    onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  >
                    <option value="">Select a Brand</option>
                    <option value="CP PLUS">CP PLUS</option>
                    <option value="Hikvision">Hikvision</option>
                    <option value="Dahua">Dahua</option>
                    <option value="Axis">Axis</option>
                    <option value="EZVIZ">EZVIZ</option>
                    <option value="TP-Link">TP-Link</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Product Name</label>
                  <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="e.g. 2MP Colorvu Bullet Camera" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Model Number</label>
                  <input type="text" required value={newProduct.model} onChange={e => setNewProduct({...newProduct, model: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="e.g. DS-2CE10DF3T-FS" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Price (₹)</label>
                  <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="e.g. 2500" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                  <textarea required value={newProduct.desc} onChange={e => setNewProduct({...newProduct, desc: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '100px' }} placeholder="Brief description of the product..."></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Image URL</label>
                  <input type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="https://example.com/image.jpg" />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Tags (comma separated)</label>
                  <input type="text" value={newProduct.tags} onChange={e => setNewProduct({...newProduct, tags: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="e.g. 2MP, Colorvu, Built-in Mic" />
                </div>

                <button type="submit" style={{ background: '#ff4a00', color: '#fff', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>
                  Save Product
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-portal { flex-direction: column !important; }
          .admin-sidebar { width: 100% !important; padding: 1rem !important; }
          .admin-sidebar h2 { margin-bottom: 1rem !important; }
          .admin-sidebar nav { flex-direction: row !important; overflow-x: auto; padding-bottom: 0.5rem; }
          .admin-sidebar nav button { flex: 0 0 auto; padding: 0.75rem !important; font-size: 0.9rem !important; }
          .admin-main { padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminPortal;
