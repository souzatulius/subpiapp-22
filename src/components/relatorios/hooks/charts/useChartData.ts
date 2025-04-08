
import { useState, useEffect, useMemo } from 'react';
import { startOfWeek, endOfWeek, format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { ChartData } from './types';

export const useChartData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    problemas: ChartData[];
    origens: ChartData[];
    responseTimes: ChartData[];
    coordinations: ChartData[];
    mediaTypes: ChartData[];
  }>({
    problemas: [],
    origens: [],
    responseTimes: [],
    coordinations: [],
    mediaTypes: []
  });

  // Usando useMemo para gerar dados mockados caso a API não retorne resultados
  const mockProblemas = useMemo(() => [
    { name: 'Poda de Árvores', value: 45 },
    { name: 'Bueiros', value: 32 },
    { name: 'Remoção de galhos', value: 18 },
    { name: 'Limpeza', value: 25 },
    { name: 'Parques e praças', value: 15 },
  ], []);

  const mockOrigens = useMemo(() => [
    { name: 'Imprensa', value: 35 },
    { name: 'SMSUB', value: 45 },
    { name: 'Secom', value: 12 },
    { name: 'Internas', value: 8 },
  ], []);

  const mockResponseTimes = useMemo(() => [
    { name: 'Seg', Demandas: 120 },
    { name: 'Ter', Demandas: 90 },
    { name: 'Qua', Demandas: 60 },
    { name: 'Qui', Demandas: 180 },
    { name: 'Sex', Demandas: 75 },
    { name: 'Sáb', Demandas: 30 },
    { name: 'Dom', Demandas: 15 },
  ], []);

  const mockCoordinations = useMemo(() => [
    { name: 'CPO', Demandas: 92 },
    { name: 'CPDU', Demandas: 87 },
    { name: 'Governo Local', Demandas: 82 },
    { name: 'Jurídico', Demandas: 75 },
    { name: 'Finanças', Demandas: 68 },
  ], []);

  const mockMediaTypes = useMemo(() => [
    { name: 'Seg', Quantidade: 10 },
    { name: 'Ter', Quantidade: 15 },
    { name: 'Qua', Quantidade: 12 },
    { name: 'Qui', Quantidade: 18 },
    { name: 'Sex', Quantidade: 22 },
    { name: 'Sáb', Quantidade: 14 },
    { name: 'Dom', Quantidade: 8 },
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const currentDate = new Date();
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Starting Monday
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Ending Sunday
        
        console.log('Tentando buscar dados dos gráficos...');
        
        // Tentativa de buscar dados reais da API
        let fetchedProblemas = [];
        let fetchedOrigens = [];
        let fetchedResponseTimes = [];
        let fetchedCoordinations = [];
        let fetchedMediaTypes = [];
        
        try {
          // Buscar dados dos problemas
          const { data: problemasData, error: problemasError } = await supabase
            .from('demandas')
            .select('problema_id, problemas:problema_id(descricao)')
            .gte('horario_publicacao', weekStart.toISOString())
            .lte('horario_publicacao', weekEnd.toISOString());
          
          if (!problemasError && problemasData && problemasData.length > 0) {
            const problemasCount: Record<string, number> = {};
            problemasData.forEach(item => {
              if (item.problemas) {
                const desc = item.problemas.descricao || 'Sem categoria';
                problemasCount[desc] = (problemasCount[desc] || 0) + 1;
              }
            });
            
            fetchedProblemas = Object.entries(problemasCount)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5);
          }
        } catch (error) {
          console.error('Erro ao buscar dados de problemas:', error);
        }
        
        try {
          // Buscar dados das origens
          const { data: origensData, error: origensError } = await supabase
            .from('demandas')
            .select('origem_id, origens:origem_id(descricao)')
            .gte('horario_publicacao', weekStart.toISOString())
            .lte('horario_publicacao', weekEnd.toISOString());
          
          if (!origensError && origensData && origensData.length > 0) {
            const origensCount: Record<string, number> = {};
            origensData.forEach(item => {
              if (item.origens) {
                const desc = item.origens.descricao || 'Sem origem';
                origensCount[desc] = (origensCount[desc] || 0) + 1;
              }
            });
            
            fetchedOrigens = Object.entries(origensCount)
              .map(([name, value]) => ({ name, value }));
          }
        } catch (error) {
          console.error('Erro ao buscar dados de origens:', error);
        }
        
        // Se não conseguir buscar dados reais, usar os dados mockados
        setData({
          problemas: fetchedProblemas.length > 0 ? fetchedProblemas : mockProblemas,
          origens: fetchedOrigens.length > 0 ? fetchedOrigens : mockOrigens,
          responseTimes: fetchedResponseTimes.length > 0 ? fetchedResponseTimes : mockResponseTimes,
          coordinations: fetchedCoordinations.length > 0 ? fetchedCoordinations : mockCoordinations,
          mediaTypes: fetchedMediaTypes.length > 0 ? fetchedMediaTypes : mockMediaTypes
        });
        
        console.log('Dados dos gráficos carregados com sucesso (alguns podem ser mockados)');
      } catch (error) {
        console.error('Erro ao buscar dados dos gráficos:', error);
        
        // Em caso de erro, usar os dados mockados
        setData({
          problemas: mockProblemas,
          origens: mockOrigens,
          responseTimes: mockResponseTimes,
          coordinations: mockCoordinations,
          mediaTypes: mockMediaTypes
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    mockProblemas,
    mockOrigens,
    mockResponseTimes,
    mockCoordinations,
    mockMediaTypes
  ]);

  return {
    ...data,
    isLoading
  };
};

export default useChartData;
