
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DemandasTable from '@/components/consultar-demandas/DemandasTable';
import { Demand } from '@/hooks/consultar-demandas';

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
      return data;
    },
  });

  // Convert the data to match our Demand type
  const demandas: Demand[] = demandasRaw.map(d => ({
    id: d.id,
    titulo: d.titulo,
    status: d.status,
    prioridade: d.prioridade,
    horario_publicacao: d.horario_publicacao,
    prazo_resposta: d.prazo_resposta,
    problema: d.problema ? {
      id: d.problema.id,
      descricao: d.problema.descricao,
      coordenacao: d.problema.coordenacao
    } : undefined,
    area_coordenacao: {
      id: '', // Default empty values
      descricao: d.problema?.coordenacao?.descricao || 'Não informada'
    },
    supervisao_tecnica: {
      id: d.supervisao_tecnica_id || '',
      descricao: ''
    },
    // Default values for other required properties
    origem: { descricao: '' },
    tipo_midia: { descricao: '' },
    autor: { nome_completo: '' },
    bairro: { nome: '' },
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
  }));

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
