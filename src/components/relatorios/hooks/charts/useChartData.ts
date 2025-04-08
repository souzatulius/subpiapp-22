
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const currentDate = new Date();
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Starting Monday
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Ending Sunday
      
      try {
        // Fetch problems (temas) distribution
        const { data: problemasData, error: problemasError } = await supabase
          .from('demandas')
          .select('problema_id, problemas:problema_id(descricao)')
          .gte('horario_publicacao', weekStart.toISOString())
          .lte('horario_publicacao', weekEnd.toISOString());

        if (problemasError) throw problemasError;
        
        // Fetch origins distribution
        const { data: origensData, error: origensError } = await supabase
          .from('demandas')
          .select('origem_id, origens:origem_id(descricao)')
          .gte('horario_publicacao', weekStart.toISOString())
          .lte('horario_publicacao', weekEnd.toISOString());

        if (origensError) throw origensError;
        
        // Fetch response times (time between demand creation and note approval)
        const { data: responseTimes, error: responseTimesError } = await supabase
          .from('demandas')
          .select(`
            id, 
            horario_publicacao, 
            notas_oficiais:notas_oficiais(id, criado_em, status)
          `)
          .gte('horario_publicacao', subDays(weekStart, 30).toISOString()) // Get more historical data for trends
          .lte('horario_publicacao', weekEnd.toISOString())
          .eq('notas_oficiais.status', 'aprovada');

        if (responseTimesError) throw responseTimesError;
        
        // Fetch coordinations (áreas) distribution
        const { data: coordinationsData, error: coordinationsError } = await supabase
          .from('demandas')
          .select(`
            problema_id,
            problemas:problema_id(
              supervisao_tecnica_id, 
              coordenacao_id,
              supervisoes:supervisao_tecnica_id(descricao),
              coordenacoes:coordenacao_id(descricao)
            )
          `)
          .gte('horario_publicacao', weekStart.toISOString())
          .lte('horario_publicacao', weekEnd.toISOString());

        if (coordinationsError) throw coordinationsError;
        
        // Fetch notes by day
        const { data: notesData, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id, criado_em')
          .gte('criado_em', weekStart.toISOString())
          .lte('criado_em', weekEnd.toISOString())
          .order('criado_em', { ascending: true });

        if (notesError) throw notesError;

        // Process problemas data
        const problemasCount: Record<string, number> = {};
        problemasData?.forEach(item => {
          if (item.problemas) {
            const desc = item.problemas.descricao || 'Sem categoria';
            problemasCount[desc] = (problemasCount[desc] || 0) + 1;
          }
        });
        
        const problemas = Object.entries(problemasCount).map(([name, value]) => ({
          name,
          value
        })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5
        
        // Process origens data
        const origensCount: Record<string, number> = {};
        origensData?.forEach(item => {
          if (item.origens) {
            const desc = item.origens.descricao || 'Sem origem';
            origensCount[desc] = (origensCount[desc] || 0) + 1;
          }
        });
        
        const origens = Object.entries(origensCount).map(([name, value]) => ({
          name,
          value
        }));
        
        // Process response times
        const dayResponseTimes: Record<string, number[]> = {};
        responseTimes?.forEach(item => {
          if (item.notas_oficiais && item.notas_oficiais.length > 0) {
            const demandaDate = new Date(item.horario_publicacao);
            const notaDate = new Date(item.notas_oficiais[0].criado_em);
            
            const diffTime = Math.abs(notaDate.getTime() - demandaDate.getTime());
            const diffMinutes = Math.ceil(diffTime / (1000 * 60));
            
            const day = format(demandaDate, 'EEE', { locale: ptBR });
            if (!dayResponseTimes[day]) {
              dayResponseTimes[day] = [];
            }
            dayResponseTimes[day].push(diffMinutes);
          }
        });
        
        const responseTimesData = Object.entries(dayResponseTimes).map(([name, times]) => {
          const average = times.length > 0 
            ? Math.round(times.reduce((acc, val) => acc + val, 0) / times.length) 
            : 0;
          return {
            name,
            Demandas: average
          };
        });
        
        // Process coordinations data
        const coordinationsCount: Record<string, number> = {};
        coordinationsData?.forEach(item => {
          if (item.problemas) {
            let desc;
            if (item.problemas.coordenacoes && item.problemas.coordenacoes.descricao) {
              desc = item.problemas.coordenacoes.descricao;
            } else if (item.problemas.supervisoes && item.problemas.supervisoes.descricao) {
              desc = item.problemas.supervisoes.descricao;
            } else {
              desc = 'Sem área';
            }
            coordinationsCount[desc] = (coordinationsCount[desc] || 0) + 1;
          }
        });
        
        const coordinations = Object.entries(coordinationsCount)
          .map(([name, value]) => ({ name, Demandas: value }))
          .sort((a, b) => b.Demandas - a.Demandas)
          .slice(0, 5); // Top 5
        
        // Process notes by day
        const notesByDay: Record<string, number> = {};
        const days = [];
        
        // Initialize all days of the week
        for (let i = 0; i < 7; i++) {
          const day = new Date(weekStart);
          day.setDate(weekStart.getDate() + i);
          const dayStr = format(day, 'EEE', { locale: ptBR });
          days.push(dayStr);
          notesByDay[dayStr] = 0;
        }
        
        notesData?.forEach(note => {
          const noteDate = new Date(note.criado_em);
          const day = format(noteDate, 'EEE', { locale: ptBR });
          notesByDay[day] = (notesByDay[day] || 0) + 1;
        });
        
        const mediaTypes = days.map(day => ({
          name: day,
          Quantidade: notesByDay[day] || 0
        }));
        
        setData({
          problemas,
          origens,
          responseTimes: responseTimesData,
          coordinations,
          mediaTypes
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    ...data,
    isLoading
  };
};

export default useChartData;
