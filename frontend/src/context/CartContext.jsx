import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import ALL_PRODUCTS from '../data/products.json';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cctv_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (_) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Checkout Modal state ──────────────────────────────────────────
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedProduct,  setSelectedProduct]  = useState(null);

  const allProducts = useMemo(() => {
    const baseProducts = Object.values(ALL_PRODUCTS).flat();
    try {
      const customProducts = JSON.parse(localStorage.getItem('cctv_custom_products') || '[]');
      return [...customProducts, ...baseProducts]; // Custom products first
    } catch(e) {
      return baseProducts;
    }
  }, []);
  const [customerDetails,  setCustomerDetails]  = useState(() => {
    try {
      const saved = localStorage.getItem('cctv_customer');
      return saved ? JSON.parse(saved) : {
        name: '', phone: '', email: '', address: '', city: '', pincode: '', landmark: '',
      };
    } catch (_) {
      return { name: '', phone: '', email: '', address: '', city: '', pincode: '', landmark: '' };
    }
  });

  useEffect(() => {
    localStorage.setItem('cctv_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cctv_customer', JSON.stringify(customerDetails));
  }, [customerDetails]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.model === product.model);
      if (existing) {
        return prev.map(item =>
          item.model === product.model ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (model) => {
    setCart((prev) => prev.filter(item => item.model !== model));
  };

  const updateQuantity = (model, quantity) => {
    if (quantity <= 0) {
      removeFromCart(model);
      return;
    }
    setCart((prev) => prev.map(item =>
      item.model === model ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount,
      isCartOpen, toggleCart,
      showCheckoutForm, setShowCheckoutForm, customerDetails, setCustomerDetails,
      searchQuery, setSearchQuery,
      allProducts, selectedProduct, setSelectedProduct
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
