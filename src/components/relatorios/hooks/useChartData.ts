
import { useState, useEffect } from 'react';
import { useChartComponents } from './useChartComponents';

export const useChartData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { chartComponents } = useChartComponents();

  // Simulamos um tempo de carregamento para feedback visual
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Retornamos os componentes diretamente, sem tentativas desnecessárias de extração de dados
  return {
    isLoading,
    chartComponents
  };
};
