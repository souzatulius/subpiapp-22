
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/types/demand';

export function useDemandas(filterStatus: string) {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    data: demandasData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['demandas', filterStatus],
    queryFn: async () => {
      try {
        console.log('Fetching demandas with status:', filterStatus);
        
        // Build the base query
        let query = supabase.from('demandas')
          .select(`
            id,
            titulo,
            status,
            prioridade,
            horario_publicacao,
            prazo_resposta,
            supervisao_tecnica_id,
            origem_id,
            tipo_midia_id,
            bairro_id,
            autor_id,
            endereco,
            nome_solicitante,
            email_solicitante,
            telefone_solicitante,
            veiculo_imprensa,
            detalhes_solicitacao,
            perguntas,
            problema_id
          `);
          
        // Apply status filter if not 'todos'
        if (filterStatus !== 'todos') {
          query = query.eq('status', filterStatus);
        }
        
        // Execute the main query
        const { data, error } = await query.order('horario_publicacao', {
          ascending: false
        });
        
        if (error) {
          console.error('Error fetching demandas:', error);
          throw error;
        }
        
        console.log('Demandas data from DB:', data);
        
        // Now fetch related information in separate queries
        const enhancedData = await Promise.all((data || []).map(async (demanda: any) => {
          // Create an enhanced demand object with all required properties
          let enhancedDemand: Partial<Demand> = { 
            ...demanda,
            supervisao_tecnica: null,
            area_coordenacao: null,
            origens_demandas: null,
            tipos_midia: null,
            bairro: null,
            autor: null
          };
          
          // Fetch areas de coordenacao (that replace supervisao_tecnica)
          if (demanda.supervisao_tecnica_id) {
            const { data: stData } = await supabase
              .from('supervisoes_tecnicas')
              .select('id, descricao')
              .eq('id', demanda.supervisao_tecnica_id)
              .maybeSingle();
              
            if (stData) {
              enhancedDemand.area_coordenacao = {
                descricao: stData.descricao
              };
            }
          }
          
          // Fetch origin
          if (demanda.origem_id) {
            const { data: origemData } = await supabase
              .from('origens_demandas')
              .select('descricao')
              .eq('id', demanda.origem_id)
              .maybeSingle();
              
            enhancedDemand.origem = origemData;
          }
          
          // Fetch media type
          if (demanda.tipo_midia_id) {
            const { data: midiaData } = await supabase
              .from('tipos_midia')
              .select('descricao')
              .eq('id', demanda.tipo_midia_id)
              .maybeSingle();
              
            enhancedDemand.tipo_midia = midiaData;
          }
          
          // Fetch neighborhood
          if (demanda.bairro_id) {
            const { data: bairroData } = await supabase
              .from('bairros')
              .select('nome')
              .eq('id', demanda.bairro_id)
              .maybeSingle();
              
            enhancedDemand.bairro = bairroData;
          }
          
          // Fetch author
          if (demanda.autor_id) {
            const { data: autorData } = await supabase
              .from('usuarios')
              .select('nome_completo')
              .eq('id', demanda.autor_id)
              .maybeSingle();
              
            enhancedDemand.autor = autorData;
          }
          
          console.log('Enhanced demand:', enhancedDemand);
          return enhancedDemand as Demand;
        }));
        
        return enhancedData || [];
      } catch (error) {
        console.error("Error fetching demands:", error);
        throw error;
      }
    },
    meta: {
      onError: (err: any) => {
        console.error('Error in onError:', err);
        toast({
          title: "Erro ao carregar demandas",
          description: err.message || "Ocorreu um erro ao carregar as demandas.",
          variant: "destructive"
        });
      }
    }
  });

  // Transform data to ensure 'perguntas' has the correct type
  const demandas: Demand[] = demandasData ? demandasData.map(item => ({
    ...item,
    perguntas: item.perguntas ? 
      (typeof item.perguntas === 'string' ? 
        JSON.parse(item.perguntas) : 
        item.perguntas as Record<string, string>) : 
      null
  })) : [];

  console.log('Processed demandas:', demandas);

  const handleSelectDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDemand(null);
  };

  return {
    demandas,
    isLoading,
    error,
    selectedDemand,
    isDetailOpen,
    handleSelectDemand,
    handleCloseDetail
  };
}
