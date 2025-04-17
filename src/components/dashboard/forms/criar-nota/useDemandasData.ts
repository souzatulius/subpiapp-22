
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/hooks/dashboard/forms/criar-nota/types';

export const useDemandasData = () => {
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch demandas
  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);
        
        // First, check if the numero_protocolo_156 column exists to avoid errors
        let hasProtoColumn = true;
        const { data: checkData, error: checkError } = await supabase
          .from('demandas')
          .select('numero_protocolo_156')
          .limit(1);
          
        if (checkError) {
          console.log('Column numero_protocolo_156 does not exist:', checkError.message);
          hasProtoColumn = false;
        }
        
        // Build the select query based on available columns
        let selectQuery = `
          id,
          titulo,
          status,
          detalhes_solicitacao,
          resumo_situacao,
          perguntas,
          problema_id,
          coordenacao_id,
          servico_id,
          horario_publicacao,
          prazo_resposta,
          prioridade,
          arquivo_url,
          anexos,
          tema:temas(
            id,
            descricao,
            coordenacao:coordenacoes(
              id,
              descricao,
              sigla
            )
          ),
          servico:servicos(
            id,
            descricao
          )
        `;
        
        // Add the protocol column if it exists
        if (hasProtoColumn) {
          selectQuery = `numero_protocolo_156, ${selectQuery}`;
        }
        
        // Fetch the demandas data with the appropriate columns
        // Important: only get demands with status 'respondida' for creating notes
        const { data: allDemandas, error: demandasError } = await supabase
          .from('demandas')
          .select(selectQuery)
          .eq('status', 'respondida') // Changed to only get 'respondida' status
          .order('horario_publicacao', { ascending: false });
        
        if (demandasError) throw demandasError;
        
        console.log('Fetched demandas with respondida status:', allDemandas ? allDemandas.length : 0);
        
        // Buscar todas as notas oficiais para verificar quais demandas já possuem notas
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id');
        
        if (notasError) throw notasError;
        
        // Criar um conjunto de IDs de demandas que já possuem notas
        const demandasComNotas = new Set(
          notasData?.map(nota => nota.demanda_id).filter(Boolean) || []
        );
        
        // Filtrar para incluir apenas demandas que não possuem notas associadas
        const demandasSemNotas = Array.isArray(allDemandas) ? 
          allDemandas.filter(demanda => demanda && typeof demanda === 'object' && !demandasComNotas.has(demanda.id)) : 
          [];
        
        console.log('All demandas with respondida status:', allDemandas ? allDemandas.length : 0);
        console.log('Demandas with notas:', demandasComNotas.size);
        console.log('Demandas without notas:', demandasSemNotas.length);
        
        // Process each demand to ensure it has proper structure - with proper type checking
        const processedDemandas = demandasSemNotas
          .filter(demanda => demanda !== null && typeof demanda === 'object')
          .map(demanda => {
            if (!demanda || typeof demanda !== 'object') {
              return null;
            }
            
            const processedDemanda: Demand = {
              id: demanda?.id || '',
              titulo: demanda?.titulo || '',
              status: demanda?.status || 'pendente',
              detalhes_solicitacao: demanda?.detalhes_solicitacao || null,
              resumo_situacao: demanda?.resumo_situacao || null,
              problema_id: demanda?.problema_id || null,
              coordenacao_id: demanda?.coordenacao_id || null,
              servico_id: demanda?.servico_id || null,
              horario_publicacao: demanda?.horario_publicacao || null,
              prazo_resposta: demanda?.prazo_resposta || null,
              prioridade: demanda?.prioridade || 'media',
              arquivo_url: demanda?.arquivo_url || null,
              anexos: demanda?.anexos || null,
              numero_protocolo_156: hasProtoColumn && demanda?.numero_protocolo_156 ? demanda.numero_protocolo_156 : null,
              tema: demanda?.tema || null, 
              servico: demanda?.servico || null,
              
              // Add placeholder for required properties that might be missing
              supervisao_tecnica: null,
              area_coordenacao: null,
              problema: null
            };
            
            return processedDemanda;
          }).filter(Boolean) as Demand[];
        
        setDemandas(processedDemandas);
        setFilteredDemandas(processedDemandas);
      } catch (error) {
        console.error('Erro ao carregar demandas:', error);
        toast({
          title: "Erro ao carregar demandas",
          description: "Não foi possível carregar as demandas disponíveis.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandas();
  }, []);

  // Filtrar demandas baseado no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filtered = demandas.filter(demanda => {
      // Check in title
      if (demanda.titulo.toLowerCase().includes(lowercaseSearchTerm)) {
        return true;
      }
      
      // Check in coordination area
      if (demanda.tema && 
          typeof demanda.tema === 'object' && 
          demanda.tema.coordenacao?.sigla?.toLowerCase().includes(lowercaseSearchTerm)) {
        return true;
      }
      
      if (demanda.area_coordenacao?.descricao?.toLowerCase().includes(lowercaseSearchTerm)) {
        return true;
      }
      
      return false;
    });
    
    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);

  return {
    demandas,
    filteredDemandas,
    searchTerm,
    setSearchTerm,
    isLoading
  };
};
