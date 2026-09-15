import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../utils/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Cart = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!customerName || !contactNo || !address) {
      setErrorMsg('Please fill in all details (Name, Contact No, Address).');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Save to Supabase
      const { error } = await supabase
        .from('orders')
        .insert([
          { 
            customer_name: customerName, 
            contact_no: contactNo, 
            address: address, 
            items: cart 
          }
        ]);

      if (error) {
        console.error("Error saving order:", error);
        // We can still proceed to WhatsApp even if DB fails, or we can halt.
        // Let's proceed as a fallback.
      }

      // 2. Open WhatsApp with pre-filled text
      const phoneNumber = "919014612983"; // Target WhatsApp Number
      
      let message = `*NEW ORDER* from Hanuman Enterprises Website\n\n`;
      message += `*Customer Details:*\n`;
      message += `Name: ${customerName}\n`;
      message += `Contact No: ${contactNo}\n`;
      message += `Address: ${address}\n`;
      message += `\n*Order Summary:*\n`;
      
      cart.forEach(item => {
        message += `- ${item.brand} ${item.model} (Qty: ${item.quantity})\n`;
      });

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Navigate to WhatsApp
      window.location.href = whatsappUrl;

      // Optional: Clear cart after successful checkout
      // clearCart();
      // toggleCart();

    } catch (err) {
      console.error("Checkout failed:", err);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={toggleCart}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart ({cart.length})</h2>
          <button onClick={toggleCart} className="cart-close">&times;</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.model} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>{item.brand} - {item.model}</p>
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
            {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.8rem', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</p>}
            <input 
              type="text" 
              placeholder="Full Name *" 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="cart-input"
              required
            />
            <input 
              type="tel" 
              placeholder="Contact Number *" 
              value={contactNo}
              onChange={e => setContactNo(e.target.value)}
              className="cart-input"
              required
            />
            <textarea 
              placeholder="Delivery Address *" 
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="cart-input"
              rows={3}
              style={{ resize: 'none' }}
              required
            />
            <button onClick={handleCheckout} disabled={isSubmitting} className="btn btn-primary checkout-btn">
              {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
            </button>
            <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
          </div>
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
        .cart-input {
          width: 100%; padding: 0.8rem; border: 1px solid #e5e7eb; border-radius: 8px;
          margin-bottom: 1rem; font-family: inherit;
        }
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
