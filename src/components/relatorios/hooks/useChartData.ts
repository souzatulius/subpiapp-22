
import { useState, useEffect } from 'react';
import { useChartComponents } from './useChartComponents';

export const useChartData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { chartComponents } = useChartComponents();

  // Mock data for when real data isn't available
  const mockData = {
    problemas: [
      { name: 'Poda de Árvores', value: 45 },
      { name: 'Bueiros', value: 32 },
      { name: 'Remoção de galhos', value: 18 },
      { name: 'Limpeza', value: 25 },
      { name: 'Parques e praças', value: 15 },
    ],
    origens: [
      { name: 'Imprensa', value: 35 },
      { name: 'SMSUB', value: 45 },
      { name: 'Secom', value: 12 },
      { name: 'Internas', value: 8 },
    ],
    responseTimes: [
      { name: 'Seg', Demandas: 48, Aprovacao: 72 },
      { name: 'Ter', Demandas: 42, Aprovacao: 65 },
      { name: 'Qua', Demandas: 36, Aprovacao: 58 },
      { name: 'Qui', Demandas: 30, Aprovacao: 52 },
      { name: 'Sex', Demandas: 24, Aprovacao: 45 },
    ],
    coordinations: [
      { name: 'CPO', Demandas: 92 },
      { name: 'CPDU', Demandas: 87 },
      { name: 'Governo Local', Demandas: 82 },
      { name: 'Jurídico', Demandas: 75 },
      { name: 'Finanças', Demandas: 68 },
    ],
    mediaTypes: [
      { name: 'Seg', Quantidade: 10 },
      { name: 'Ter', Quantidade: 15 },
      { name: 'Qua', Quantidade: 12 },
      { name: 'Qui', Quantidade: 18 },
      { name: 'Sex', Quantidade: 22 },
      { name: 'Sáb', Quantidade: 14 },
      { name: 'Dom', Quantidade: 8 },
    ]
  };

  // Simulamos um tempo de carregamento para feedback visual
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Return mock data directly to ensure charts always have data to display
  return {
    isLoading,
    error,
    chartComponents,
    ...mockData // Spread the mock data so it's always available
  };
};
