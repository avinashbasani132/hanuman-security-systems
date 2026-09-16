import { useEffect } from 'react';

/**
 * useScrollReveal
 * Observes every [data-sr] element in the DOM and adds
 * the class "sr-visible" when it enters the viewport.
 * Call once at the App level.
 */
const useScrollReveal = () => {
  useEffect(() => {
    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible');
            // Unobserve after reveal so it doesn't re-hide on scroll-up
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,   // trigger when 12% of element is visible
        rootMargin: '0px 0px -40px 0px', // slightly before the bottom edge
      }
    );

    // Observe all current [data-sr] elements
    const observe = () => {
      document.querySelectorAll('[data-sr]').forEach((el) => {
        observer.observe(el);
      });
    };

    observe();

    // Also observe after a short delay to catch dynamically rendered elements
    const timer = setTimeout(observe, 400);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);
};

export default useScrollReveal;
