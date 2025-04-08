
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

    // Só adicionar o listener de scroll se não for mobile ou se o transform não estiver desabilitado
    if (!isMobile || !disableTransformOnMobile) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
    
    return undefined;
  }, [isMobile, disableTransformOnMobile]);

  // No mobile, se o transform estiver desabilitado, retorna valores padrão sem efeito
  if (isMobile && disableTransformOnMobile) {
    return {
      opacity: 1,
      transform: 'none'
    };
  }

  // Calcula a opacidade baseada na posição do scroll apenas para desktop
  const opacity = scrollY <= threshold 
    ? 1 
    : Math.max(0, 1 - (scrollY - threshold) / fadeDistance);
  
  return {
    opacity,
    transform: scrollY <= threshold
      ? 'none' 
      : `translateY(${Math.min((scrollY - threshold) / 2, fadeDistance/2)}px)`
  };
};

export default useScrollFade;
