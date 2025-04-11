
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DemandasTable from '@/components/consultar-demandas/DemandasTable';
import { Demand } from '@/hooks/consultar-demandas/types';
import { toast } from '@/components/ui/use-toast';

const ConsultarDemandasTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  // Check if user is admin
  React.useEffect(() => {
    const checkAdmin = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { data: permissionsData } = await supabase
          .from('usuario_permissoes')
          .select('permissao_id, permissoes:permissao_id(nivel_acesso)')
          .eq('usuario_id', session.session.user.id)
          .single();

        const isAdminUser = permissionsData?.permissoes?.nivel_acesso >= 80 || false;
        setIsAdmin(isAdminUser);
      }
    };
    
    checkAdmin();
  }, []);
  
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
            bairro:bairro_id(id, nome)
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
      // Add required fallback properties to match the Demand type
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
      anexos: null
    };
  });

  // Updated handleViewDemand to match expected function signature (string instead of Demand)
  const handleViewDemand = (id: string) => {
    navigate(`/dashboard/comunicacao/responder?id=${id}`);
  };

  // Handler for viewNota required by the component
  const handleViewNota = (demandId: string) => {
    navigate(`/dashboard/notas/nova?demanda=${demandId}`);
  };

  return (
    <DemandasTable 
      demandas={demandas}
      onViewDemand={handleViewDemand}
      onViewNota={handleViewNota}
      isLoading={isLoading}
      totalCount={demandas.length}
      page={page}
      pageSize={pageSize}
      setPage={setPage}
      setPageSize={setPageSize}
      isAdmin={isAdmin}
    />
  );
};

export default ConsultarDemandasTable;
