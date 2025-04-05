
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DemandasTable from '@/components/consultar-demandas/DemandasTable';
import { Demand } from '@/hooks/consultar-demandas/types';

const ConsultarDemandasTable = () => {
  const navigate = useNavigate();
  
  const { data: demandasRaw = [], isLoading } = useQuery({
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
          problema_id,
          problema:problema_id (
            id, 
            descricao,
            coordenacao_id,
            coordenacao:coordenacao_id (id, descricao)
          ),
          coordenacao_id,
          supervisao_tecnica_id
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Convert the data to match our Demand type with safe fallbacks
  const demandas: Demand[] = demandasRaw.map(d => {
    // First create a safe base object with all required properties and normalize the data
    // Use any type assertion to avoid TypeScript errors when dealing with potential SelectQueryErrors
    const rawDemand = d as any;
    
    return {
      id: rawDemand.id || '',
      titulo: rawDemand.titulo || '',
      status: rawDemand.status || '',
      prioridade: rawDemand.prioridade || '',
      horario_publicacao: rawDemand.horario_publicacao || '',
      prazo_resposta: rawDemand.prazo_resposta || '',
      problema: rawDemand.problema ? {
        id: rawDemand.problema.id || '',
        descricao: rawDemand.problema.descricao || '',
        coordenacao: rawDemand.problema.coordenacao || undefined,
        supervisao_tecnica: null
      } : null,
      problema_id: rawDemand.problema_id || undefined,
      area_coordenacao: {
        id: rawDemand.problema?.coordenacao?.id || '',
        descricao: rawDemand.problema?.coordenacao?.descricao || 'Não informada'
      },
      supervisao_tecnica: {
        id: rawDemand.supervisao_tecnica_id || '',
        descricao: ''
      },
      // Default values for other required properties
      origem: { descricao: '' },
      tipo_midia: { descricao: '' },
      autor: { nome_completo: '' },
      bairro: { id: '', nome: '' },
      nome_solicitante: '',
      email_solicitante: '',
      telefone_solicitante: '',
      veiculo_imprensa: '',
      endereco: '',
      detalhes_solicitacao: '',
      servico: { descricao: '' },
      arquivo_url: null,
      anexos: null,
      perguntas: null
    };
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
