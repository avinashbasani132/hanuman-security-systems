import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

const Cart = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart, customerDetails, setShowCheckoutForm } = useCart();
  const { user, setShowLoginModal } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowCheckoutForm(true);
    toggleCart(); // Close the cart drawer when opening checkout modal
  };

  return (
    <div className="cart-overlay" onClick={toggleCart}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart ({cart.length})</h2>
          <button onClick={toggleCart} className="cart-close">&times;</button>
        </div>

        {orderSuccess ? (
          <div style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#111827' }}>Order Placed Successfully!</h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Thank you for your request. We have received your order and will contact you shortly.
            </p>
            <button onClick={() => { toggleCart(); setOrderSuccess(false); }} className="btn btn-primary" style={{ width: '100%' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty.</p>
              ) : (
                cart.map(item => (
                  <div key={item.model} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p>{item.brand} - {item.model}</p>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                          {item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(item.model, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.model, item.quantity + 1)}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.model)} className="remove-btn">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#374151' }}>Total:</h3>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#111827', fontWeight: 900 }}>
                    ₹{cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0).toLocaleString('en-IN')}
                  </h3>
                </div>
                {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.8rem', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</p>}
                
                <button onClick={handleCheckout} disabled={isSubmitting} className="btn btn-primary checkout-btn">
                  Proceed to Checkout ➔
                </button>
                <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .cart-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 2000;
          display: flex; justify-content: flex-end;
          backdrop-filter: blur(4px);
        }
        .cart-drawer {
          width: 100%; max-width: 400px;
          background: #fff; height: 100%;
          display: flex; flex-direction: column;
          box-shadow: -5px 0 20px rgba(0,0,0,0.1);
          animation: slideIn 0.3s ease forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-header {
          padding: 1.5rem; border-bottom: 1px solid #f0f0f0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .cart-header h2 { margin: 0; font-size: 1.4rem; color: #111827; }
        .cart-close {
          background: #f3f4f6; border: none; font-size: 1.5rem;
          width: 36px; height: 36px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .cart-items {
          flex: 1; overflow-y: auto; padding: 1.5rem;
        }
        .empty-cart { text-align: center; color: #6b7280; margin-top: 2rem; }
        .cart-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1rem 0; border-bottom: 1px solid #f3f4f6;
        }
        .cart-item-info h4 { margin: 0 0 0.2rem 0; font-size: 0.95rem; color: #111827; }
        .cart-item-info p { margin: 0; font-size: 0.8rem; color: #6b7280; }
        .cart-item-actions { display: flex; align-items: center; gap: 1rem; }
        .qty-controls {
          display: flex; align-items: center; gap: 0.5rem;
          background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 0.2rem;
        }
        .qty-controls button {
          background: none; border: none; padding: 0 0.5rem; cursor: pointer;
          font-size: 1.1rem; font-weight: bold; color: #374151;
        }
        .remove-btn { background: none; border: none; cursor: pointer; color: #ef4444; font-size: 1.1rem; }
        .cart-footer { padding: 1.5rem; border-top: 1px solid #f0f0f0; background: #fafbfc; }
        
        .saved-details {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.25rem;
        }
        .saved-details-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.5rem;
        }
        .saved-details-header h4 { margin: 0; font-size: 0.9rem; color: #374151; font-weight: 700; }
        .edit-details-btn {
          background: none; border: none; color: #ff4a00;
          font-size: 0.8rem; font-weight: 600; cursor: pointer; text-decoration: underline;
        }
        .saved-details p { margin: 0; font-size: 0.85rem; color: #6b7280; line-height: 1.4; }
        
        .checkout-btn { width: 100%; text-align: center; margin-bottom: 1rem; font-size: 0.95rem; padding: 1rem; }
        .clear-cart-btn {
          width: 100%; background: none; border: none; color: #6b7280;
          cursor: pointer; font-size: 0.85rem; text-decoration: underline;
        }
        @media (max-width: 768px) {
          .cart-drawer {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
