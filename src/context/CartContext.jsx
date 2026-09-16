import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cctv_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // ── Customer Details Modal state ──────────────────────────────────────────
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [pendingProduct,   setPendingProduct]   = useState(null);
  const [customerDetails,  setCustomerDetails]  = useState(() => {
    try {
      const saved = localStorage.getItem('cctv_customer');
      return saved ? JSON.parse(saved) : {
        name: '', phone: '', email: '', address: '', city: '', pincode: '', landmark: '',
      };
    } catch (e) {
      return { name: '', phone: '', email: '', address: '', city: '', pincode: '', landmark: '' };
    }
  });

  useEffect(() => {
    localStorage.setItem('cctv_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cctv_customer', JSON.stringify(customerDetails));
  }, [customerDetails]);

  // Open customer form with the product that triggered it
  const openCustomerForm = (product) => {
    setPendingProduct(product);
    setShowCustomerForm(true);
  };

  // Called when the customer submits the form — actually adds product to cart
  const confirmAddToCart = () => {
    if (!pendingProduct) return;
    setCart((prev) => {
      const existing = prev.find(item => item.model === pendingProduct.model);
      if (existing) {
        return prev.map(item =>
          item.model === pendingProduct.model ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pendingProduct, quantity: 1 }];
    });
    setPendingProduct(null);
    setShowCustomerForm(false);
  };

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
      isCartOpen, setIsCartOpen, toggleCart,
      showCustomerForm, setShowCustomerForm,
      pendingProduct,
      customerDetails, setCustomerDetails,
      openCustomerForm, confirmAddToCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
