
import { useState, useEffect } from 'react';

export function useScrollBehavior() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // If the scroll direction changes or we're at the top of the page
      if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
        setScrollDirection(direction);
      }
      
      // Show header when at the top or scrolling up
      if (scrollY < 10) {
        setIsHeaderVisible(true);
      } else if (direction === 'down' && scrollY > 100) {
        setIsHeaderVisible(false);
      } else if (direction === 'up') {
        setIsHeaderVisible(true);
      }
      
      setScrollPosition(scrollY);
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [scrollDirection]);

  return { scrollDirection, scrollPosition, isHeaderVisible };
}
