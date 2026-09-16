import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Products from './components/Products';
import Solutions from './components/Solutions';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Cart from './components/Cart';
import CustomerFormModal from './components/CustomerFormModal';
import AdminPortal from './components/AdminPortal';
import ProductPage from './components/ProductPage';
import BrandPage from './components/BrandPage';
import useScrollReveal from './hooks/useScrollReveal';

function App() {
  useScrollReveal();
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#admin') {
    return <AdminPortal />;
  }

  if (currentHash.startsWith('#product/')) {
    const model = decodeURIComponent(currentHash.replace('#product/', ''));
    return (
      <CartProvider>
        <div className="app">
          <Header />
          <Cart />
          <CustomerFormModal />
          <ProductPage model={model} />
          <Footer />
        </div>
      </CartProvider>
    );
  }

  if (currentHash.startsWith('#brand/')) {
    const brand = decodeURIComponent(currentHash.replace('#brand/', ''));
    return (
      <CartProvider>
        <div className="app">
          <Header />
          <Cart />
          <CustomerFormModal />
          <BrandPage brand={brand} />
          <Footer />
        </div>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <div className="app">
        <Header />
        <Cart />
        <CustomerFormModal />
        <main>
          {/* Hero — no sr, it's above the fold */}
          <Hero />

          {/* Features */}
          <div data-sr="fade-up">
            <Features />
          </div>

          {/* Products */}
          <div data-sr="fade-up" data-sr-delay="1">
            <Products />
          </div>

          {/* Solutions */}
          <div data-sr="fade-left">
            <Solutions />
          </div>

          {/* Testimonials */}
          <div data-sr="zoom-up">
            <Testimonials />
          </div>

          {/* FAQ */}
          <div data-sr="fade-right">
            <FAQ />
          </div>

          {/* Contact */}
          <div data-sr="fade-up">
            <Contact />
          </div>
        </main>
        <div data-sr="fade-up">
          <Footer />
        </div>
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default App;

