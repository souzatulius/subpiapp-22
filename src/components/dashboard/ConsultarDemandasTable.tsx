
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DemandasTable from '@/components/consultar-demandas/DemandasTable';
import { Demand } from '@/hooks/consultar-demandas/types';
import { toast } from '@/components/ui/use-toast';
import { NotaOficial } from '@/types/nota';

const ConsultarDemandasTable = () => {
  const navigate = useNavigate();
  
  const { data: demandasRaw = [], isLoading } = useQuery({
    queryKey: ['demandas'],
    queryFn: async () => {
      try {
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
            origem_id,
            origem:origem_id(id, descricao),
            tipo_midia_id,
            tipo_midia:tipo_midia_id(id, descricao),
            autor_id,
            autor:autor_id(id, nome_completo),
            bairro_id,
            bairro:bairro_id(id, nome),
            respostas:respostas_demandas(id, texto, comentarios),
            notas:notas_oficiais(id, titulo)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching demands:", error);
          toast({
            title: "Erro ao carregar demandas",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.error("Exception when fetching demands:", err);
        return [];
      }
    },
  });

  // Create a safe transformation with fallbacks for all properties
  const demandas = (demandasRaw || []).map((d: any): Demand => {
    return {
      id: d?.id || '',
      titulo: d?.titulo || '',
      status: d?.status || '',
      prioridade: d?.prioridade || '',
      horario_publicacao: d?.horario_publicacao || '',
      prazo_resposta: d?.prazo_resposta || '',
      area_coordenacao: {
        id: d?.problema?.coordenacao?.id || '',
        descricao: d?.problema?.coordenacao?.descricao || 'Não informada'
      },
      problema: d?.problema ? {
        id: d.problema.id || '',
        descricao: d.problema.descricao || '',
        coordenacao: d.problema.coordenacao || undefined
      } : null,
      problema_id: d?.problema_id || undefined,
      supervisao_tecnica: {
        id: '', // We're not using this field anymore
        descricao: ''
      },
      origem: d?.origem || { id: '', descricao: '' },
      tipo_midia: d?.tipo_midia || { id: '', descricao: '' },
      bairro: d?.bairro || { nome: '' },
      autor: d?.autor || { nome_completo: '' },
      endereco: '',
      nome_solicitante: '',
      email_solicitante: '',
      telefone_solicitante: '',
      veiculo_imprensa: '',
      detalhes_solicitacao: '',
      perguntas: null,
      servico: { id: '', descricao: '' },
      arquivo_url: null,
      anexos: null,
      resposta: d?.respostas && d.respostas.length > 0 ? {
        id: d.respostas[0].id,
        demanda_id: d.id,
        texto: d.respostas[0].texto,
        usuario_id: '', // Add the required fields
        criado_em: '',
        comentarios: d.respostas[0].comentarios
      } : null,
      notas: d?.notas || []
    };
  });

  const handleViewDemand = (demand: Demand) => {
    navigate(`/dashboard/comunicacao/responder?id=${demand.id}`);
  };
  
  const handleViewNote = (nota: NotaOficial) => {
    navigate(`/dashboard/comunicacao/notas/detalhe?id=${nota.id}`);
  };
  
  const handleEditNote = (nota: NotaOficial) => {
    navigate(`/dashboard/comunicacao/notas/editar?id=${nota.id}`);
  };
  
  const handleCreateNote = (demand: Demand) => {
    navigate(`/dashboard/comunicacao/criar-nota?demandaId=${demand.id}`);
  };

  return (
    <DemandasTable 
      demandas={demandas}
      onViewDemand={handleViewDemand}
      onCreateNote={handleCreateNote}
      onViewNote={handleViewNote}
      onEditNote={handleEditNote}
      isLoading={isLoading}
    />
  );
};

export default ConsultarDemandasTable;
