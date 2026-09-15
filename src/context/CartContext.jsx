import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Attempt to load from localStorage if available
    try {
      const savedCart = localStorage.getItem('cctv_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cctv_cart', JSON.stringify(cart));
  }, [cart]);

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
      isCartOpen, setIsCartOpen, toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
