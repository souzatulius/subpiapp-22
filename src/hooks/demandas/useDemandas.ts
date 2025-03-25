
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
        // Construir a consulta base
        let query = supabase.from('demandas')
          .select(`
            id,
            titulo,
            status,
            prioridade,
            horario_publicacao,
            prazo_resposta,
            supervisao_tecnica_id,
            servico_id,
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
            perguntas
          `);
          
        // Aplicar filtro de status se não for 'todos'
        if (filterStatus !== 'todos') {
          query = query.eq('status', filterStatus);
        }
        
        // Executar a consulta principal
        const { data, error } = await query.order('horario_publicacao', {
          ascending: false
        });
        
        if (error) throw error;
        
        // Agora vamos buscar as informações relacionadas em consultas separadas
        const enhancedData = await Promise.all((data || []).map(async (demanda) => {
          // Create an enhanced demand object with all required properties
          let enhancedDemand: any = { 
            ...demanda,
            supervisao_tecnica: null,
            servico: null, 
            origem: null,
            tipo_midia: null,
            bairro: null,
            autor: null,
            area_coordenacao: null
          };
          
          // Buscar supervisão técnica
          if (demanda.supervisao_tecnica_id) {
            const { data: stData } = await supabase
              .from('supervisoes_tecnicas')
              .select('descricao')
              .eq('id', demanda.supervisao_tecnica_id)
              .single();
              
            enhancedDemand.supervisao_tecnica = stData;
            // Also set area_coordenacao to match the supervisao_tecnica
            enhancedDemand.area_coordenacao = stData;
          }
          
          // Buscar serviço
          if (demanda.servico_id) {
            const { data: servicoData } = await supabase
              .from('servicos')
              .select('descricao')
              .eq('id', demanda.servico_id)
              .single();
              
            enhancedDemand.servico = servicoData;
          }
          
          // Buscar origem
          if (demanda.origem_id) {
            const { data: origemData } = await supabase
              .from('origens_demandas')
              .select('descricao')
              .eq('id', demanda.origem_id)
              .single();
              
            enhancedDemand.origem = origemData;
          }
          
          // Buscar tipo de mídia
          if (demanda.tipo_midia_id) {
            const { data: midiaData } = await supabase
              .from('tipos_midia')
              .select('descricao')
              .eq('id', demanda.tipo_midia_id)
              .single();
              
            enhancedDemand.tipo_midia = midiaData;
          }
          
          // Buscar bairro
          if (demanda.bairro_id) {
            const { data: bairroData } = await supabase
              .from('bairros')
              .select('nome')
              .eq('id', demanda.bairro_id)
              .single();
              
            enhancedDemand.bairro = bairroData;
          }
          
          // Buscar autor
          if (demanda.autor_id) {
            const { data: autorData } = await supabase
              .from('usuarios')
              .select('nome_completo')
              .eq('id', demanda.autor_id)
              .single();
              
            enhancedDemand.autor = autorData;
          }
          
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
        toast({
          title: "Erro ao carregar demandas",
          description: err.message || "Ocorreu um erro ao carregar as demandas.",
          variant: "destructive"
        });
      }
    }
  });

  // Transformar os dados para garantir que 'perguntas' está com o tipo correto
  const demandas: Demand[] = demandasData ? demandasData.map(item => ({
    ...item,
    perguntas: item.perguntas ? 
      (typeof item.perguntas === 'string' ? 
        JSON.parse(item.perguntas) : 
        item.perguntas as Record<string, string>) : 
      null
  })) : [];

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
