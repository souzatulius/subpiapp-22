
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/hooks/dashboard/forms/criar-nota/types';

export const useFetchDemandas = () => {
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
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
        const processedDemandas = Array.isArray(allDemandas) ? allDemandas.map(demanda => {
          if (!demanda) return null;
          
          return {
            id: demanda.id,
            titulo: demanda.titulo,
            status: demanda.status,
            detalhes_solicitacao: demanda.detalhes_solicitacao,
            resumo_situacao: demanda.resumo_situacao,
            problema_id: demanda.problema_id,
            coordenacao_id: demanda.coordenacao_id,
            servico_id: demanda.servico_id,
            horario_publicacao: demanda.horario_publicacao,
            prazo_resposta: demanda.prazo_resposta,
            prioridade: demanda.prioridade,
            arquivo_url: demanda.arquivo_url,
            anexos: demanda.anexos,
            tema: demanda.tema, 
            servico: demanda.servico,
            
            // Add placeholder for required properties that might be missing
            supervisao_tecnica: null,
            area_coordenacao: null,
            problema: null
          } as Demand;
        }).filter(Boolean) : [];
        
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
      
      // Check in coordination area
      if (typeof demanda.tema === 'object' && 
          demanda.tema?.coordenacao?.sigla?.toLowerCase().includes(lowercaseSearchTerm)) {
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
    isLoading
  };
};
