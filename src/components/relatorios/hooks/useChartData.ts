
import { useState, useEffect } from 'react';
import { useChartComponents } from './useChartComponents';
import { supabase } from '@/integrations/supabase/client';

export const useChartData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState({
    problemas: [],
    origens: [],
    responseTimes: [],
    coordinations: [],
    mediaTypes: []
  });
  const { chartComponents } = useChartComponents();

  // Load data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch problemas data from Supabase
        const { data: problemasData, error: problemasError } = await supabase
          .from('problemas')
          .select('id, descricao')
          .limit(5);

        if (problemasError) throw problemasError;

        // Fetch origens data from Supabase
        const { data: origensData, error: origensError } = await supabase
          .from('origens_demandas')
          .select('id, descricao')
          .limit(5);

        if (origensError) throw origensError;

        // Fetch coordenações data from Supabase
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .limit(5);

        if (coordenacoesError) throw coordenacoesError;

        // Transform data for charts (using random data for demonstration)
        const problemasTransformed = (problemasData || []).map(problem => ({
          name: problem.descricao,
          value: Math.floor(Math.random() * 50) + 10
        }));

        const origensTransformed = (origensData || []).map(origem => ({
          name: origem.descricao,
          value: Math.floor(Math.random() * 50) + 10
        }));

        const coordenacoesTransformed = (coordenacoesData || []).map(coord => ({
          name: coord.descricao,
          Demandas: Math.floor(Math.random() * 100) + 50
        }));

        // Set chart data
        setChartData({
          problemas: problemasTransformed,
          origens: origensTransformed,
          coordinations: coordenacoesTransformed,
          responseTimes: [
            { name: 'Seg', Demandas: 48, Aprovacao: 72 },
            { name: 'Ter', Demandas: 42, Aprovacao: 65 },
            { name: 'Qua', Demandas: 36, Aprovacao: 58 },
            { name: 'Qui', Demandas: 30, Aprovacao: 52 },
            { name: 'Sex', Demandas: 24, Aprovacao: 45 },
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
        });

        console.log('Dados dos gráficos carregados com sucesso:', {
          problemas: problemasTransformed,
          origens: origensTransformed,
          coordinations: coordenacoesTransformed
        });
      } catch (error) {
        console.error('Erro ao carregar dados dos gráficos:', error);
        setError('Falha ao carregar dados do Supabase');
        
        // Use mock data as fallback
        setChartData({
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
        });
      } finally {
        // Simulate a minimum loading time to avoid UI flash
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    fetchData();
  }, []);

  // Return the data and loading state
  return {
    isLoading,
    error,
    chartComponents,
    ...chartData // Spread the chart data so it's always available
  };
};
