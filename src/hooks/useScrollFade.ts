
import { useEffect, useState } from 'react';

interface ScrollFadeOptions {
  threshold?: number;
  fadeDistance?: number;
}

/**
 * A hook that creates a fade effect based on scroll position
 * 
 * @param options Configuration options
 * @param options.threshold Scroll position at which fade begins (default: 20)
 * @param options.fadeDistance Distance over which the fade occurs (default: 100)
 * @returns An object with opacity and transform values for styling
 */
export function useScrollFade({ threshold = 20, fadeDistance = 100 }: ScrollFadeOptions = {}) {
  const [scrollY, setScrollY] = useState(0);
  const [styles, setStyles] = useState({
    opacity: 1,
    transform: 'translateY(0px)',
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Calculate opacity and transform based on scroll position
    if (scrollY <= threshold) {
      setStyles({
        opacity: 1,
        transform: 'translateY(0px)',
      });
    } else {
      const scrollProgress = Math.min((scrollY - threshold) / fadeDistance, 1);
      const opacity = Math.max(1 - scrollProgress, 0);
      const translateY = -scrollProgress * 20; // 20px maximum translation

      setStyles({
        opacity,
        transform: `translateY(${translateY}px)`,
      });
    }
  }, [scrollY, threshold, fadeDistance]);

  return styles;
}
