
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/types/demand';

export const useDemandas = (filterStatus: string = 'pendente') => {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: demandas, isLoading, error, refetch } = useQuery({
    queryKey: ['demandas', filterStatus],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
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
            autor:autor_id (id, nome_completo)
          `)
          .eq('status', filterStatus)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching demandas:', error);
          toast({
            title: 'Erro ao carregar demandas',
            description: error.message,
            variant: 'destructive',
          });
          return [];
        }

        return data || [];
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
