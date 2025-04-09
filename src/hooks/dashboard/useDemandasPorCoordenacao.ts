
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type DemandaCountByCoordination = {
  dia: string;
  dia_formatado: string;
  data: Date;
  coordenacao_id: string;
  coordenacao_nome: string;
  quantidade: number;
};

type NotasCount = {
  dia: string;
  dia_formatado: string;
  data: Date;
  quantidade: number;
};

type CoordenacaoInfo = {
  id: string;
  nome: string;
  cor: string;
};

export const useDemandasPorCoordenacao = () => {
  const [demandas, setDemandas] = useState<DemandaCountByCoordination[]>([]);
  const [notas, setNotas] = useState<NotasCount[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<CoordenacaoInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Define cores para as coordenações
  const coresCoordenacao: Record<string, string> = {
    'Comunicação': '#0D6EFD',  // azul escuro
    'Zeladoria': '#FD7E14',    // laranja
    'Cultura': '#20C997',      // verde limão
    'Outros': '#212529',       // cinza escuro
  };

  useEffect(() => {
    const fetchData = async () => {
      // Check if we should fetch new data (if no data or last fetch was more than 1 hour ago)
      if (!lastFetched || new Date().getTime() - lastFetched.getTime() > 60 * 60 * 1000) {
        setIsLoading(true);
        setError(null);
        
        try {
          // Get start and end of current week (Monday to Friday)
          const today = new Date();
          const startDay = startOfWeek(today, { weekStartsOn: 1 }); // Monday
          
          // Fetch coordenações
          const { data: coordenacoesData, error: coordenacoesError } = await supabase
            .from('coordenacoes')
            .select('id, descricao')
            .order('descricao');
          
          if (coordenacoesError) throw coordenacoesError;
          
          // Map coordenações to their respective colors
          const coordenacoesWithColors = coordenacoesData.map((coord) => {
            let cor = '#212529'; // Default color
            
            // Assign color based on name
            if (coord.descricao.includes('Comunicação')) {
              cor = coresCoordenacao['Comunicação'];
            } else if (coord.descricao.includes('Zeladoria')) {
              cor = coresCoordenacao['Zeladoria'];
            } else if (coord.descricao.includes('Cultura')) {
              cor = coresCoordenacao['Cultura'];
            }
            
            return {
              id: coord.id,
              nome: coord.descricao,
              cor
            };
          });
          
          setCoordenacoes(coordenacoesWithColors);
          
          // Create array of weekdays (Monday to Friday)
          const weekdays = Array.from({ length: 5 }, (_, i) => {
            const date = addDays(startDay, i);
            return {
              data: date,
              dia: format(date, 'yyyy-MM-dd'),
              dia_formatado: format(date, 'EEEE', { locale: ptBR })
            };
          });
          
          // Fetch demandas data directly with SQL query
          const startDateStr = format(startDay, 'yyyy-MM-dd');
          const endDateStr = format(addDays(startDay, 4), 'yyyy-MM-dd');
          
          const { data: demandasData, error: demandasError } = await supabase
            .from('demandas')
            .select(`
              id, 
              atualizado_em, 
              coordenacao_id, 
              coordenacao:coordenacoes(id, descricao)
            `)
            .gte('atualizado_em', startDateStr)
            .lte('atualizado_em', endDateStr);
          
          if (demandasError) throw demandasError;
          
          // Process demandas data (manually aggregate)
          const groupedDemandas: Record<string, DemandaCountByCoordination> = {};
          
          if (demandasData) {
            demandasData.forEach(item => {
              const date = new Date(item.atualizado_em);
              const day = format(date, 'yyyy-MM-dd');
              const coordId = item.coordenacao_id || 'sem_coordenacao';
              const coordNome = item.coordenacao?.descricao || 'Sem coordenação';
              
              const key = `${day}-${coordId}`;
              
              if (!groupedDemandas[key]) {
                groupedDemandas[key] = {
                  dia: day,
                  dia_formatado: format(date, 'EEEE', { locale: ptBR }),
                  data: date,
                  coordenacao_id: coordId,
                  coordenacao_nome: coordNome,
                  quantidade: 0
                };
              }
              
              groupedDemandas[key].quantidade += 1;
            });
          }
          
          const processedDemandas = Object.values(groupedDemandas);
          
          // Ensure we have entries for all days of the week for each coordenação
          const fullDemandasData: DemandaCountByCoordination[] = [];
          
          weekdays.forEach(day => {
            coordenacoesWithColors.forEach(coord => {
              const existing = processedDemandas.find(d => 
                d.dia === day.dia && 
                d.coordenacao_id === coord.id
              );
              
              if (existing) {
                fullDemandasData.push({
                  ...existing,
                  dia_formatado: day.dia_formatado
                });
              } else {
                fullDemandasData.push({
                  dia: day.dia,
                  dia_formatado: day.dia_formatado,
                  data: day.data,
                  coordenacao_id: coord.id,
                  coordenacao_nome: coord.nome,
                  quantidade: 0
                });
              }
            });
          });
          
          setDemandas(fullDemandasData);
          
          // Fetch notas data directly
          const { data: notasData, error: notasError } = await supabase
            .from('notas_oficiais')
            .select('id, criado_em')
            .gte('criado_em', startDateStr)
            .lte('criado_em', endDateStr);
          
          if (notasError) throw notasError;
          
          // Process notas data (manually aggregate)
          const groupedNotas: Record<string, NotasCount> = {};
          
          if (notasData) {
            notasData.forEach(item => {
              const date = new Date(item.criado_em);
              const day = format(date, 'yyyy-MM-dd');
              
              if (!groupedNotas[day]) {
                groupedNotas[day] = {
                  dia: day,
                  dia_formatado: format(date, 'EEEE', { locale: ptBR }),
                  data: date,
                  quantidade: 0
                };
              }
              
              groupedNotas[day].quantidade += 1;
            });
          }
          
          const processedNotas = Object.values(groupedNotas);
          
          // Ensure we have entries for all days of the week for notas
          const fullNotasData = weekdays.map(day => {
            const existing = processedNotas.find(n => n.dia === day.dia);
            
            if (existing) {
              return {
                ...existing,
                dia_formatado: day.dia_formatado
              };
            }
            
            return {
              dia: day.dia,
              dia_formatado: day.dia_formatado,
              data: day.data,
              quantidade: 0
            };
          });
          
          setNotas(fullNotasData);
          setLastFetched(new Date());
        } catch (err: any) {
          console.error('Error fetching dashboard data:', err);
          setError(err.message || 'Erro ao carregar dados');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [lastFetched]);

  // Prepare chart data structure
  const getChartData = () => {
    if (!demandas.length || !notas.length) return null;
    
    const weekDays = Array.from(
      new Set(demandas.map(d => d.dia))
    ).sort();
    
    const labels = weekDays.map(day => {
      const demanda = demandas.find(d => d.dia === day);
      return demanda ? demanda.dia_formatado.charAt(0).toUpperCase() + demanda.dia_formatado.slice(1, 3) : '';
    });
    
    // Create datasets for each coordenação
    const coordenacaoDatasets = coordenacoes.map(coord => {
      return {
        label: coord.nome,
        data: weekDays.map(day => {
          const encontrado = demandas.find(
            d => d.dia === day && d.coordenacao_id === coord.id
          );
          return encontrado ? encontrado.quantidade : 0;
        }),
        backgroundColor: coord.cor,
        borderColor: coord.cor,
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.9 / (coordenacoes.length + 1) // Leave room for notas
      };
    });
    
    // Create dataset for notas
    const notasDataset = {
      label: 'Notas de Imprensa',
      data: weekDays.map(day => {
        const encontrado = notas.find(n => n.dia === day);
        return encontrado ? encontrado.quantidade : 0;
      }),
      backgroundColor: '#212529', // cinza escuro
      borderColor: '#212529',
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.8,
      categoryPercentage: 0.9 / (coordenacoes.length + 1) // Same size as others
    };
    
    // Combine all datasets
    const datasets = [...coordenacaoDatasets, notasDataset];
    
    return {
      labels,
      datasets
    };
  };
  
  return {
    chartData: getChartData(),
    isLoading,
    error,
    coordenacoes,
    refresh: () => setLastFetched(null)
  };
};
