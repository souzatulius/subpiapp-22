
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DemandasTable from '@/components/consultar-demandas/DemandasTable';
import { Demand } from '@/hooks/consultar-demandas/types';
import { toast } from '@/components/ui/use-toast';
import { useDemandasQuery } from '@/hooks/consultar-demandas/useDemandasQuery';

const ConsultarDemandasTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  // Use the custom hook instead of directly querying here
  const { data: demandas = [], isLoading, error } = useDemandasQuery();
  
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

  // Log data for debugging
  React.useEffect(() => {
    if (demandas && demandas.length > 0) {
      console.log('Demandas loaded:', demandas.length);
    }
    if (error) {
      console.error('Error loading demandas:', error);
      toast({
        title: "Erro ao carregar demandas",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar as demandas",
        variant: "destructive",
      });
    }
  }, [demandas, error]);

  // Updated handleViewDemand to match expected function signature
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
