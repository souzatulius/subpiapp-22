
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demanda } from '@/components/dashboard/forms/responder-demanda/types';

export const useFetchDemandas = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>([]);
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);
        
        const { data: allDemandas, error } = await supabase
          .from('demandas')
          .select(`
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
          `)
          .in('status', ['pendente', 'em_andamento'])
          .order('horario_publicacao', { ascending: false });
        
        if (error) throw error;
        
        // Process each demand to ensure it has proper structure
        const processedDemandas = Array.isArray(allDemandas) ? allDemandas
          .filter(demanda => demanda !== null && typeof demanda === 'object')
          .map(demanda => {
            if (!demanda || typeof demanda !== 'object') {
              return null;
            }
            
            // Ensure proper structure for tema object
            let temaObject = null;
            if (demanda.tema && typeof demanda.tema === 'object') {
              temaObject = {
                id: demanda.tema.id || '',
                descricao: demanda.tema.descricao || '',
                coordenacao: demanda.tema.coordenacao || null
              };
            }
            
            // Create a properly typed Demanda object
            const processedDemanda: Demanda = {
              id: demanda.id || '',
              titulo: demanda.titulo || '',
              status: demanda.status || '',
              detalhes_solicitacao: demanda.detalhes_solicitacao || null,
              resumo_situacao: demanda.resumo_situacao || null,
              problema_id: demanda.problema_id || '',
              coordenacao_id: demanda.coordenacao_id || null,
              servico_id: demanda.servico_id || null,
              horario_publicacao: demanda.horario_publicacao || '',
              prazo_resposta: demanda.prazo_resposta || null,
              prioridade: demanda.prioridade || 'media', // Ensure prioridade is never undefined
              arquivo_url: demanda.arquivo_url || null,
              anexos: demanda.anexos || null,
              tema: temaObject,
              servico: demanda.servico || null,
              
              // Add default values for required properties
              supervisao_tecnica: null,
              supervisao_tecnica_id: null,
              autor_id: null,
              autor: null,
              bairro_id: null,
              bairro: null,
              tipo_midia_id: null,
              origem_id: null
            };
            
            return processedDemanda;
          }).filter(Boolean) as Demanda[] : [];
        
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
      
      // Check in coordination area - with safe type checking
      if (demanda.tema && 
          typeof demanda.tema === 'object' && 
          demanda.tema.coordenacao && 
          typeof demanda.tema.coordenacao === 'object' &&
          demanda.tema.coordenacao.sigla &&
          demanda.tema.coordenacao.sigla.toLowerCase().includes(lowercaseSearchTerm)) {
        return true;
      }
      
      return false;
    });
    
    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);

  return {
    demandas,
    filteredDemandas,
    selectedDemanda,
    setSelectedDemanda,
    searchTerm,
    setSearchTerm,
    isLoading,
    setDemandas
  };
};
