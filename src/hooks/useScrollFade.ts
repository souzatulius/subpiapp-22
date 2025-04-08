
import { useState, useEffect } from 'react';

interface ScrollFadeOptions {
  threshold?: number;
  fadeDistance?: number;
}

export const useScrollFade = ({ threshold = 0, fadeDistance = 100 }: ScrollFadeOptions = {}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll position
  const opacity = scrollY <= threshold 
    ? 1 
    : Math.max(0, 1 - (scrollY - threshold) / fadeDistance);
  
  // Return style object with minimal transform to avoid unwanted spacing
  return {
    opacity,
    transform: scrollY <= threshold ? 'none' : `translateY(${Math.min((scrollY - threshold) / 2, fadeDistance/2)}px)`
  };
};

export default useScrollFade;
