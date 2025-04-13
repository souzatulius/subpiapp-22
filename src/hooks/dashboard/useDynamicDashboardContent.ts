
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DynamicContentItem {
  id: string;
  title: string;
  description?: string;
  date: Date;
  tag?: string;
  link?: string;
  coordenacao?: string;
}

export const useDynamicDashboardContent = () => {
  const [notasItems, setNotasItems] = useState<DynamicContentItem[]>([]);
  const [demandasItems, setDemandasItems] = useState<DynamicContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch notas data
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('id, titulo, texto, criado_em, status')
          .order('criado_em', { ascending: false })
          .limit(5);
        
        if (notasError) {
          console.error("Error fetching notas:", notasError);
        } else if (notasData) {
          const formattedNotas = notasData.map(nota => ({
            id: nota.id,
            title: nota.titulo,
            description: nota.texto ? nota.texto.substring(0, 120) + '...' : '',
            date: new Date(nota.criado_em),
            tag: nota.status
          }));
          setNotasItems(formattedNotas);
        }
        
        // Fetch demandas data
        const { data: demandasData, error: demandasError } = await supabase
          .from('demandas')
          .select('id, titulo, detalhes_solicitacao, horario_publicacao, status, coordenacao:coordenacao_id(descricao)')
          .order('horario_publicacao', { ascending: false })
          .limit(5);
        
        if (demandasError) {
          console.error("Error fetching demandas:", demandasError);
        } else if (demandasData) {
          const formattedDemandas = demandasData.map(demanda => ({
            id: demanda.id,
            title: demanda.titulo,
            description: demanda.detalhes_solicitacao ? demanda.detalhes_solicitacao.substring(0, 120) + '...' : '',
            date: new Date(demanda.horario_publicacao),
            tag: demanda.status,
            coordenacao: demanda.coordenacao?.descricao || 'Não especificada'
          }));
          setDemandasItems(formattedDemandas);
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };
  
  return {
    notasItems,
    demandasItems,
    isLoading,
    formatTimeAgo,
    formatDate
  };
};
