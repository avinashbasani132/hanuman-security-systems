import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Cart = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // 1. Generate PDF
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Order Details - Hanuman Enterprises', 14, 22);
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerName || 'N/A'}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);

    // Table
    const tableColumn = ["Brand", "Model", "Type", "Qty"];
    const tableRows = [];

    cart.forEach(item => {
      const rowData = [
        item.brand,
        item.model,
        item.type || 'Product',
        item.quantity
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [255, 74, 0] }
    });

    // Save PDF
    const fileName = `Order_${new Date().getTime()}.pdf`;
    doc.save(fileName);

    // 2. Open WhatsApp with pre-filled text
    const phoneNumber = "919014612983"; // Target WhatsApp Number
    
    let message = `Hello Hanuman Enterprises!\n\nI would like to place an order.\n\n`;
    if (customerName) message += `Name: *${customerName}*\n`;
    message += `\n*Order Summary:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.brand} ${item.model} (Qty: ${item.quantity})\n`;
    });
    
    message += `\n_I have also downloaded the PDF order summary on my device and can attach it here._`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WA in a new tab
    window.open(whatsappUrl, '_blank');
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
            <input 
              type="text" 
              placeholder="Your Name (Optional)" 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="cart-input"
            />
            <button onClick={handleCheckout} className="btn btn-primary checkout-btn">
              Download PDF & Place Order via WhatsApp
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
      `}</style>
    </div>
  );
};

export default Cart;
