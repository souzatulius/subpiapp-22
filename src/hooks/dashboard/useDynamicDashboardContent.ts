
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: Date;
  tag?: string;
  link?: string;
  coordenacao?: string;
}

interface StatItem {
  name: string;
  value: number;
  color?: string;
}

export const useDynamicDashboardContent = () => {
  const [latestNotes, setLatestNotes] = useState<TimelineItem[]>([]);
  const [latestDemands, setLatestDemands] = useState<TimelineItem[]>([]);
  const [statistics, setStatistics] = useState<{
    demands: StatItem[];
    notes: StatItem[];
    news: StatItem[];
  }>({
    demands: [],
    notes: [],
    news: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardContent = async () => {
      setIsLoading(true);
      try {
        // Fetch latest notes
        const { data: notesData, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id, titulo, conteudo, criado_em, status')
          .order('criado_em', { ascending: false })
          .limit(5);

        if (notesError) throw notesError;

        // Fetch latest demands
        const { data: demandsData, error: demandsError } = await supabase
          .from('demandas')
          .select(`
            id, 
            titulo, 
            descricao, 
            criado_em, 
            status, 
            problemas:problema_id (id, descricao),
            coordenacoes:coordenacao_id (id, descricao)
          `)
          .order('criado_em', { ascending: false })
          .limit(5);

        if (demandsError) throw demandsError;

        // Format notes data
        const formattedNotes = notesData.map(note => ({
          id: note.id,
          title: note.titulo,
          description: note.conteudo ? note.conteudo.substring(0, 100) + '...' : '',
          date: new Date(note.criado_em),
          tag: note.status
        }));

        // Format demands data
        const formattedDemands = demandsData.map(demand => ({
          id: demand.id,
          title: demand.titulo,
          description: demand.descricao ? demand.descricao.substring(0, 100) + '...' : '',
          date: new Date(demand.criado_em),
          tag: demand.status,
          coordenacao: demand.coordenacoes?.descricao || 'Sem coordenação'
        }));

        // Set the state with the fetched data
        setLatestNotes(formattedNotes);
        setLatestDemands(formattedDemands);

        // Mock statistics data (in a real app, you'd fetch this from the backend)
        setStatistics({
          demands: [
            { name: 'Pendentes', value: 12, color: '#FF8042' },
            { name: 'Em Andamento', value: 8, color: '#FFBB28' },
            { name: 'Concluídas', value: 20, color: '#00C49F' }
          ],
          notes: [
            { name: 'Aprovadas', value: 15, color: '#00C49F' },
            { name: 'Pendentes', value: 5, color: '#FFBB28' },
            { name: 'Rejeitadas', value: 2, color: '#FF8042' }
          ],
          news: [
            { name: 'Publicadas', value: 25, color: '#0088FE' },
            { name: 'Rascunhos', value: 10, color: '#8884d8' }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard content:', error);
        
        // Provide mock data in case of error
        setLatestNotes([
          {
            id: '1',
            title: 'Nota de exemplo 1',
            description: 'Esta é uma nota de exemplo para visualização...',
            date: new Date(),
            tag: 'pendente'
          },
          {
            id: '2',
            title: 'Nota de exemplo 2',
            description: 'Esta é outra nota de exemplo para visualização...',
            date: new Date(Date.now() - 86400000),
            tag: 'aprovada'
          }
        ]);
        
        setLatestDemands([
          {
            id: '1',
            title: 'Demanda de exemplo 1',
            description: 'Esta é uma demanda de exemplo para visualização...',
            date: new Date(),
            tag: 'pendente',
            coordenacao: 'Coordenação de Infraestrutura'
          },
          {
            id: '2',
            title: 'Demanda de exemplo 2',
            description: 'Esta é outra demanda de exemplo para visualização...',
            date: new Date(Date.now() - 86400000),
            tag: 'concluída',
            coordenacao: 'Coordenação de Comunicação'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardContent();
  }, []);

  return {
    latestNotes,
    latestDemands,
    statistics,
    isLoading
  };
};
