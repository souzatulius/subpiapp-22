
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '../usePermissions';
import { Demand } from '@/types/demand';

export const useDemandasQuery = (
  query: string,
  statusFilter: string,
  dateRange: [Date | null, Date | null],
  areaFilter: string[]
) => {
  const { isAdmin, userCoordination } = usePermissions();
  const [filteredData, setFilteredData] = useState<Demand[]>([]);

  // Fetch data with filters
  const { data: demandasData, isLoading, error } = useQuery({
    queryKey: ['demandas', statusFilter, dateRange, areaFilter, userCoordination, isAdmin],
    queryFn: async () => {
      try {
        console.log('Fetching demandas with filters');
        
        // Build the base query
        let queryBuilder = supabase.from('demandas')
          .select(`
            id,
            titulo,
            status,
            prioridade,
            horario_publicacao,
            prazo_resposta,
            problema_id,
            origem_id,
            tipo_midia_id,
            bairro_id,
            autor_id,
            supervisao_tecnica_id,
            perguntas,
            detalhes_solicitacao,
            endereco,
            email_solicitante,
            telefone_solicitante,
            nome_solicitante,
            veiculo_imprensa,
            autor:autor_id (
              nome_completo
            ),
            bairro:bairro_id (
              nome
            ),
            problema:problema_id (
              descricao,
              supervisao_tecnica:supervisao_tecnica_id (
                id, 
                descricao,
                coordenacao_id
              )
            ),
            origem:origem_id (
              descricao
            ),
            tipo_midia:tipo_midia_id (
              descricao
            )
          `);
          
        // If not admin, restrict to user's coordination
        if (!isAdmin && userCoordination) {
          // First get the supervisao_tecnica IDs that belong to the user's coordination
          const { data: supervisaoIds, error: supervisaoError } = await supabase
            .from('supervisoes_tecnicas')
            .select('id')
            .eq('coordenacao_id', userCoordination);
            
          if (supervisaoError) throw supervisaoError;
          
          // Then get the problems that use these supervisoes_tecnicas
          const { data: problemaIds, error: problemaError } = await supabase
            .from('problemas')
            .select('id')
            .in('supervisao_tecnica_id', supervisaoIds?.map(s => s.id) || []);
            
          if (problemaError) throw problemaError;
          
          // Filter demandas by these problema_ids
          queryBuilder = queryBuilder.in('problema_id', problemaIds?.map(p => p.id) || []);
        }
        
        // Apply status filter if not 'all'
        if (statusFilter && statusFilter !== 'all') {
          queryBuilder = queryBuilder.eq('status', statusFilter);
        }
        
        // Apply date range filter if both dates are provided
        if (dateRange[0] && dateRange[1]) {
          queryBuilder = queryBuilder
            .gte('horario_publicacao', dateRange[0].toISOString())
            .lte('horario_publicacao', dateRange[1].toISOString());
        }
        
        // Execute the query with ordering
        const { data, error } = await queryBuilder
          .order('horario_publicacao', { ascending: false });
          
        if (error) throw error;
        
        // Process data to match Demand type
        const processedData = data.map((item: any) => {
          // Process perguntas field
          const perguntas = item.perguntas ? 
            (typeof item.perguntas === 'string' ? 
              JSON.parse(item.perguntas) : 
              item.perguntas) : 
            null;
            
          // Create a properly typed object
          const demand: Demand = {
            id: item.id,
            titulo: item.titulo,
            status: item.status,
            prioridade: item.prioridade,
            horario_publicacao: item.horario_publicacao,
            prazo_resposta: item.prazo_resposta,
            supervisao_tecnica_id: item.supervisao_tecnica_id,
            supervisao_tecnica: item.problema?.supervisao_tecnica || null,
            area_coordenacao: item.problema?.supervisao_tecnica ? 
              { descricao: item.problema.supervisao_tecnica.descricao } : null,
            origem: item.origem || null,
            tipo_midia: item.tipo_midia || null,
            bairro: item.bairro || null,
            autor: item.autor || null,
            endereco: item.endereco,
            nome_solicitante: item.nome_solicitante,
            email_solicitante: item.email_solicitante,
            telefone_solicitante: item.telefone_solicitante,
            veiculo_imprensa: item.veiculo_imprensa,
            detalhes_solicitacao: item.detalhes_solicitacao,
            perguntas: perguntas,
            servico: null // Default to null
          };
          
          return demand;
        });
        
        return processedData;
      } catch (error) {
        console.error("Error fetching demands:", error);
        throw error;
      }
    },
    meta: {
      onError: (err: any) => {
        console.error('Error in demandasQuery:', err);
      }
    }
  });

  // Apply client-side filtering based on query string and area filter
  useEffect(() => {
    if (!demandasData) {
      setFilteredData([]);
      return;
    }

    let filtered = [...demandasData];

    // Apply text query filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.titulo.toLowerCase().includes(lowerQuery) || 
        (item.detalhes_solicitacao && item.detalhes_solicitacao.toLowerCase().includes(lowerQuery)) ||
        (item.area_coordenacao?.descricao && item.area_coordenacao.descricao.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply area filter
    if (areaFilter.length > 0) {
      filtered = filtered.filter(item => {
        // Get the area ID from the item
        const itemAreaId = item.supervisao_tecnica?.id;
        return itemAreaId && areaFilter.includes(itemAreaId);
      });
    }

    setFilteredData(filtered);
  }, [demandasData, query, areaFilter]);

  return {
    data: filteredData,
    isLoading,
    error
  };
};
