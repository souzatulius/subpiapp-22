
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFeedback } from '@/components/ui/feedback-provider';
import { Demand } from './types';

// Define simplified types to avoid complex unions
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
        
        const filteredDemandasData = demandasData.filter(d => !notaDemandaIds.includes(d.id));
        
        // Process each demanda safely
        const processedDemandas: Demand[] = filteredDemandasData.map(demanda => {
          // Create a properly typed Demand object
          const processedDemanda: Demand = {
            id: demanda.id,
            titulo: demanda.titulo || '',
            status: demanda.status || '',
            prioridade: demanda.prioridade || '',
            horario_publicacao: demanda.horario_publicacao || '',
            prazo_resposta: demanda.prazo_resposta || '',
            coordenacao_id: demanda.coordenacao_id || undefined,
            problema_id: demanda.problema_id || undefined,
            supervisao_tecnica_id: demanda.supervisao_tecnica_id || undefined,
            resumo_situacao: '',
            comentarios: '',
            supervisao_tecnica: null,
            area_coordenacao: demanda.coordenacao ? { 
              descricao: demanda.coordenacao.descricao || '' 
            } : null,
            origem: null,
            tipo_midia: null,
            bairro: null,
            autor: null,
            endereco: demanda.endereco || null,
            nome_solicitante: demanda.nome_solicitante || null,
            email_solicitante: demanda.email_solicitante || null,
            telefone_solicitante: demanda.telefone_solicitante || null,
            veiculo_imprensa: demanda.veiculo_imprensa || null,
            detalhes_solicitacao: demanda.detalhes_solicitacao || null,
            perguntas: demanda.perguntas || null,
            servico: null,
            arquivo_url: demanda.arquivo_url || null,
            anexos: demanda.anexos || null,
            problema: demanda.problema ? {
              descricao: demanda.problema.descricao || null,
              id: demanda.problema.id
            } : null,
            tema: demanda.tema ? {
              descricao: demanda.tema.descricao || '',
              id: demanda.tema.id,
              coordenacao: demanda.tema.coordenacao || null
            } : null
          };
          
          return processedDemanda;
        });
        
        // For each demanda, fetch its latest response to get comments
        for (let i = 0; i < processedDemandas.length; i++) {
          try {
            const { data: responseData } = await supabase
              .from('respostas_demandas')
              .select('comentarios')
              .eq('demanda_id', processedDemandas[i].id)
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (responseData && responseData.length > 0 && responseData[0].comentarios) {
              // Update comentarios field
              processedDemandas[i].comentarios = responseData[0].comentarios;
            }
          } catch (err) {
            console.error(`Error fetching response for demanda ${processedDemandas[i].id}:`, err);
          }
        }
        
        setDemandas(processedDemandas);
        setFilteredDemandas(processedDemandas);
        
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
