
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFeedback } from '@/components/ui/feedback-provider';

// Define simplified types to avoid complex unions
export interface DemandCoordination {
  id: string;
  descricao?: string;
  sigla?: string;
  [key: string]: any;
}

export interface DemandTema {
  id: string;
  descricao?: string;
  coordenacao?: DemandCoordination;
  [key: string]: any;
}

export interface DemandProblema {
  id: string;
  descricao?: string;
  coordenacao?: DemandCoordination;
  [key: string]: any;
}

export interface Demand {
  id: string;
  titulo?: string;
  detalhes_solicitacao?: string;
  horario_publicacao?: string;
  prioridade?: string;
  status?: string;
  coordenacao_id?: string;
  tema_id?: string;
  problema_id?: string;
  problema?: DemandProblema;
  tema?: DemandTema;
  coordenacao?: DemandCoordination;
  resumo_situacao?: string;
  comentarios?: string;
  [key: string]: any;
}

export const useDemandasData = () => {
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showFeedback } = useFeedback();
  
  // Fetch demandas that have been responded to but don't have a nota_oficial yet
  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);
        
        // First get all demandas with status 'em_andamento'
        const { data: demandasData, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            *,
            tema:tema_id (*),
            problema:problema_id (*),
            coordenacao:coordenacao_id (*)
          `)
          .eq('status', 'em_andamento')
          .order('horario_publicacao', { ascending: false });
        
        if (demandasError) throw demandasError;
        
        if (!demandasData || demandasData.length === 0) {
          setDemandas([]);
          setFilteredDemandas([]);
          setIsLoading(false);
          return;
        }
        
        // Now get all notas_oficiais that reference these demandas
        const demandaIds = demandasData.map(d => d.id);
        
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id')
          .in('demanda_id', demandaIds);
        
        if (notasError) throw notasError;
        
        // Filter out demandas that already have notas_oficiais
        const notaDemandaIds = notasData?.map(n => n.demanda_id) || [];
        
        const filteredDemandas = demandasData.filter(d => !notaDemandaIds.includes(d.id))
          .map(demanda => {
            // Process each demanda to add any extra fields needed
            return {
              ...demanda,
              resumo_situacao: demanda.resumo_situacao || '',
              comentarios: '' // Initialize empty comentarios
            };
          });
        
        // For each demanda, fetch its latest response to get comments
        for (const demanda of filteredDemandas) {
          try {
            const { data: responseData } = await supabase
              .from('respostas_demandas')
              .select('comentarios')
              .eq('demanda_id', demanda.id)
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (responseData && responseData.length > 0 && responseData[0].comentarios) {
              // Update comentarios field
              demanda.comentarios = responseData[0].comentarios;
            }
          } catch (err) {
            console.error(`Error fetching response for demanda ${demanda.id}:`, err);
          }
        }
        
        setDemandas(filteredDemandas);
        setFilteredDemandas(filteredDemandas);
        
      } catch (error: any) {
        console.error('Error fetching demandas:', error);
        showFeedback('error', `Erro ao carregar demandas: ${error.message || 'Erro desconhecido'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDemandas();
  }, [showFeedback]);
  
  // Filter demandas based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    const filtered = demandas.filter(demanda => 
      (demanda.titulo && demanda.titulo.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (demanda.detalhes_solicitacao && demanda.detalhes_solicitacao.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (demanda.resumo_situacao && demanda.resumo_situacao.toLowerCase().includes(lowerCaseSearchTerm))
    );
    
    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);
  
  return {
    demandas,
    filteredDemandas,
    isLoading,
    searchTerm,
    setSearchTerm
  };
};
