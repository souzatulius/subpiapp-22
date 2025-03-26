
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';
import { useCurrentUser } from '@/components/settings/access-control/hooks/useCurrentUser';
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

export const useDemandasQuery = () => {
  const { currentUserId } = useCurrentUser();
  const { isAdmin, userCoordination } = usePermissions();
  
  return useQuery({
    queryKey: ['demandas', isAdmin, userCoordination],
    queryFn: async () => {
      console.log('Fetching demandas, isAdmin:', isAdmin, 'userCoordination:', userCoordination);
      
      try {
        // Base query - select all visible demandas
        let query = supabase.from('demandas_visiveis');
        
        // If not admin, filter by user's coordination
        if (!isAdmin && userCoordination) {
          // Join with problemas and supervisoes_tecnicas to filter by coordination
          const { data: filteredDemandas, error: filterError } = await supabase
            .from('demandas')
            .select(`
              *,
              problemas!inner (
                id,
                descricao,
                supervisao_tecnica_id,
                supervisao_tecnica:supervisao_tecnica_id (
                  id, 
                  descricao,
                  coordenacao_id
                )
              )
            `)
            .eq('problemas.supervisao_tecnica.coordenacao_id', userCoordination);
            
          if (filterError) {
            console.error('Error fetching filtered demandas:', filterError);
            throw filterError;
          }
          
          // Extract the demanda IDs that match the user's coordination
          const filteredIds = filteredDemandas.map(d => d.id);
          
          if (filteredIds.length > 0) {
            // Fetch the full demanda details for the filtered IDs
            query = query.in('id', filteredIds);
          } else {
            // No demandas found for this coordination
            return [];
          }
        }
        
        // Now add the detailed fields selection
        const { data: allDemandas, error: demandasError } = await query
          .select(`
            *,
            area_coordenacao:area_coordenacao_id(descricao),
            servico:servico_id(descricao),
            origem:origem_id(descricao),
            tipo_midia:tipo_midia_id(descricao),
            bairro:bairro_id(nome),
            autor:autor_id(nome_completo)
          `)
          .order('horario_publicacao', { ascending: false });
        
        if (demandasError) {
          console.error('Error fetching demandas:', demandasError);
          throw demandasError;
        }
        
        // Parse perguntas JSON if it's a string and transform to proper Demand type
        const processedData = allDemandas?.map(item => {
          if (typeof item.perguntas === 'string') {
            try {
              item.perguntas = JSON.parse(item.perguntas);
            } catch (e) {
              item.perguntas = null;
            }
          }

          // Transform to match Demand type
          return {
            id: item.id,
            titulo: item.titulo,
            status: item.status,
            prioridade: item.prioridade,
            horario_publicacao: item.horario_publicacao,
            prazo_resposta: item.prazo_resposta,
            supervisao_tecnica_id: item.supervisao_tecnica_id,
            supervisao_tecnica: item.supervisao_tecnica ? {
              id: item.supervisao_tecnica_id,
              descricao: item.problema_descricao || ''
            } : null,
            area_coordenacao: item.area_coordenacao || { descricao: '' },
            origem: item.origem || { descricao: '' },
            tipo_midia: item.tipo_midia || { descricao: '' },
            bairro: item.bairro || { nome: '' },
            autor: item.autor || { nome_completo: '' },
            endereco: item.endereco,
            nome_solicitante: item.nome_solicitante,
            email_solicitante: item.email_solicitante,
            telefone_solicitante: item.telefone_solicitante,
            veiculo_imprensa: item.veiculo_imprensa,
            detalhes_solicitacao: item.detalhes_solicitacao,
            perguntas: item.perguntas,
            servico: item.servico
          } as Demand;
        }) || [];
        
        return processedData;
      } catch (error: any) {
        console.error('Query error:', error);
        toast({
          title: "Erro ao carregar demandas",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
    },
    meta: {
      onError: (err: any) => {
        console.error('Query error:', err);
        toast({
          title: "Erro ao carregar demandas",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  });
};
