
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, DemandFilter, DemandList, DemandCards } from '@/components/demandas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Demandas = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('pendente');

  // Fetch demandas data with status filter
  const { data: demandas, isLoading, error } = useQuery({
    queryKey: ['demandas', filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('demandas')
        .select(`
          *,
          area_coordenacao:area_coordenacao_id(descricao),
          servico:servico_id(descricao),
          origem:origem_id(descricao),
          tipo_midia:tipo_midia_id(descricao),
          bairro:bairro_id(nome),
          autor:autor_id(nome_completo)
        `);
      
      if (filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }
      
      const { data, error } = await query.order('horario_publicacao', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
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

  // If there's an error, we can handle it here as well to provide a backup UI
  if (error) {
    console.error("Error loading demands:", error);
  }

  return (
    <Layout>
      <DemandFilter 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      {viewMode === 'cards' ? (
        <DemandCards demandas={demandas || []} isLoading={isLoading} />
      ) : (
        <DemandList demandas={demandas || []} isLoading={isLoading} />
      )}
    </Layout>
  );
};

export default Demandas;
