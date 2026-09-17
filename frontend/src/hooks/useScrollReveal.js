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

    const observeNodes = (nodes) => {
      nodes.forEach(node => {
        if (node.nodeType === 1) { // ELEMENT_NODE
          if (node.hasAttribute('data-sr')) {
            observer.observe(node);
          }
          const children = node.querySelectorAll('[data-sr]');
          children.forEach(child => observer.observe(child));
        }
      });
    };

    // Observe all current [data-sr] elements
    observeNodes([document.body]);

    // Use MutationObserver to catch dynamically added elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          observeNodes(mutation.addedNodes);
        }
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

export default useScrollReveal;
