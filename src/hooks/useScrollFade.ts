
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ScrollFadeOptions {
  threshold?: number;
  fadeDistance?: number;
  disableTransformOnMobile?: boolean;
}

export const useScrollFade = ({ 
  threshold = 0, 
  fadeDistance = 100,
  disableTransformOnMobile = true
}: ScrollFadeOptions = {}) => {
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useIsMobile();

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
  
  // Return style object with transform disabled on mobile if specified
  return {
    opacity,
    transform: (scrollY <= threshold || (isMobile && disableTransformOnMobile)) 
      ? 'none' 
      : `translateY(${Math.min((scrollY - threshold) / 2, fadeDistance/2)}px)`
  };
};

export default useScrollFade;
