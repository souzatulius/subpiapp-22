
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DemandasTable from '@/components/consultar-demandas/DemandasTable';
import { Demand } from '@/hooks/consultar-demandas';

const ConsultarDemandasTable = () => {
  const navigate = useNavigate();
  
  const { data: demandas = [], isLoading } = useQuery({
    queryKey: ['demandas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demandas')
        .select(`
          id,
          titulo,
          status,
          prioridade,
          horario_publicacao,
          prazo_resposta,
          area_coordenacao (id, descricao),
          problema (
            id, 
            descricao,
            coordenacao (id, descricao)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Demand[];
    },
  });

  const handleViewDemand = (demand: Demand) => {
    navigate(`/dashboard/comunicacao/responder?id=${demand.id}`);
  };

  return (
    <DemandasTable 
      demandas={demandas}
      onViewDemand={handleViewDemand}
      isLoading={isLoading}
    />
  );
};

export default ConsultarDemandasTable;
