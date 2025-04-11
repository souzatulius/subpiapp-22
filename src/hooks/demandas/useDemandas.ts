
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/types/demand';

export const useDemandas = (filterStatus?: string) => {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: demandas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['demandas', filterStatus],
    queryFn: async () => {
      try {
        console.log("Fetching demandas with status filter:", filterStatus);
        
        let query = supabase
          .from('demandas')
          .select(`
            *,
            problema:problema_id (
              id, 
              descricao,
              coordenacao_id,
              coordenacao:coordenacao_id (id, descricao)
            ),
            supervisao_tecnica:supervisao_tecnica_id (id, descricao),
            coordenacao:coordenacao_id (id, descricao),
            origem:origem_id (id, descricao),
            tipo_midia:tipo_midia_id (id, descricao),
            bairro:bairro_id (id, nome),
            autor:autor_id (id, nome_completo),
            servico:servico_id (id, descricao),
            notas:notas_oficiais (id, titulo, status)
          `);

        if (filterStatus) {
          query = query.eq('status', filterStatus);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching demandas:', error);
          toast({
            title: 'Erro ao carregar demandas',
            description: error.message,
            variant: 'destructive',
          });
          return [];
        }

        console.log(`Found ${data.length} demandas`);
        
        // Count demandas with and without notas for debugging
        const demandasWithNotas = data.filter(d => d.notas && d.notas.length > 0);
        const demandasWithoutNotas = data.filter(d => !d.notas || d.notas.length === 0);
        console.log("All demandas:", data.length);
        console.log("Demandas with notas:", demandasWithNotas.length);
        console.log("Demandas without notas:", demandasWithoutNotas.length);

        // Transform data to match the expected Demand type
        return (data || []).map(item => {
          return {
            ...item,
            // Ensure these fields are properly available for the UI
            title: item.titulo || '', 
            area_coordenacao: {
              descricao: item.coordenacao?.descricao || ''
            },
            supervisao_tecnica: item.supervisao_tecnica || { id: undefined, descricao: '' },
            servico: item.servico || { descricao: '' },
            anexos: item.anexos || null,
          } as unknown as Demand;
        });
      } catch (error: any) {
        console.error('Exception fetching demandas:', error);
        toast({
          title: 'Erro ao carregar demandas',
          description: error.message || 'Erro desconhecido',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

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
    refetch,
    selectedDemand,
    isDetailOpen,
    handleSelectDemand,
    handleCloseDetail,
    setSelectedDemand,
  };
};
