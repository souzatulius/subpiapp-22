
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AttentionBox from '@/components/ui/attention-box';
import UnifiedViewContainer from '@/components/shared/unified-view/UnifiedViewContainer';
import LabelBadge from '@/components/ui/label-badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ConsultarDemandasContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [origemFilter, setOrigemFilter] = useState('todas');
  const [demandas, setDemandas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [demandToDelete, setDemandToDelete] = useState<{ id: string; title: string; hasNotes: boolean } | null>(null);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [origens, setOrigens] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('list');

  // Fetch origens on mount
  useEffect(() => {
    const fetchOrigens = async () => {
      const { data, error } = await supabase
        .from('origens_demandas')
        .select('id, descricao');

      if (error) {
        console.error('Erro ao buscar origens:', error);
        toast({
          title: 'Erro ao buscar origens',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        setOrigens(data || []);
      }
    };

    fetchOrigens();
  }, []);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const { data: profileData } = await supabase
          .from('usuarios')  
          .select('status')
          .eq('id', data.session.user.id)
          .single();

        const { data: permissionsData } = await supabase
          .from('usuario_permissoes')
          .select('permissao_id, permissoes:permissao_id(nivel_acesso)')
          .eq('usuario_id', data.session.user.id)
          .single();

        const isAdminUser = permissionsData?.permissoes?.nivel_acesso >= 80 || false;
        setIsAdmin(isAdminUser);
      }
    };
    
    checkAdmin();
  }, []);

  // Fetch demands from Supabase
  const fetchDemandas = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('demandas')
        .select(`*, 
          problemas ( descricao ), 
          origens_demandas ( descricao )`,
          { count: 'exact' }
        )
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('criado_em', { ascending: false });

      if (searchTerm) {
        query = query.ilike('titulo', `%${searchTerm}%`);
      }

      if (statusFilter && statusFilter !== 'todos') {
        query = query.eq('status', statusFilter);
      }

      if (origemFilter && origemFilter !== 'todas') {
        query = query.eq('origem_id', origemFilter);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Erro ao buscar demandas:', error);
        toast({
          title: 'Erro ao buscar demandas',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        setDemandas(
          data?.map((item: any) => ({
            ...item,
            problema_descricao: item.problemas?.descricao,
            origem_descricao: item.origens_demandas?.descricao,
          })) || []
        );
        setTotalCount(count || 0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, origemFilter, page, pageSize]);

  // Fetch demands on mount and when filters change
  useEffect(() => {
    fetchDemandas();
  }, [fetchDemandas]);

  // Handle navigation to view demanda
  const handleViewDemanda = (demanda: any) => {
    navigate(`/dashboard/demandas/${demanda.id}`);
  };

  // Handle navigation to view nota
  const handleViewNota = (demandId: string) => {
    navigate(`/dashboard/notas/nova?demanda=${demandId}`);
  };

  // Check if demand has notes
  const checkIfDemandHasNotes = async (demandId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('notas_oficiais')  
      .select('*', { count: 'exact' })
      .eq('demanda_id', demandId);

    return (data?.length || 0) > 0;
  };

  // Handle deletion of demand
  const handleDeleteDemand = async (demanda: any) => {
    setDemandToDelete({
      id: demanda.id,
      title: demanda.titulo || 'Sem título',
      hasNotes: await checkIfDemandHasNotes(demanda.id)
    });
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion of demand
  const confirmDeleteDemand = async () => {
    if (!demandToDelete) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('demandas')
        .delete()
        .eq('id', demandToDelete.id);

      if (error) {
        console.error('Erro ao excluir demanda:', error);
        toast({
          title: 'Erro ao excluir demanda',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Demanda excluída com sucesso!',
        });
        fetchDemandas();
      }
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDemandToDelete(null);
    }
  };

  const statusOptions = [
    { id: 'todos', label: 'Todos os status' },
    { id: 'pendente', label: 'Pendente' },
    { id: 'em-andamento', label: 'Em Andamento' },
    { id: 'concluido', label: 'Concluído' },
    { id: 'cancelado', label: 'Cancelado' },
    { id: 'aguardando-nota', label: 'Aguardando Nota' }
  ];

  const origensOptions = [
    { id: 'todas', label: 'Todas as origens' },
    ...origens.map(origem => ({
      id: origem.id,
      label: origem.descricao
    }))
  ];

  // Render demanda card
  const renderDemandaCard = (demanda: any) => {
    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">{demanda.titulo || 'Sem título'}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <LabelBadge 
                label="Status" 
                value={demanda.status} 
                variant="status" 
                size="sm"
              />
              {demanda.prioridade && (
                <LabelBadge 
                  label="Prioridade" 
                  value={demanda.prioridade} 
                  variant="priority" 
                  size="sm"
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center">
            <span className="font-medium mr-1">Origem:</span> 
            {demanda.origem_descricao || 'Não especificada'}
          </p>
          {demanda.criado_em && (
            <p>
              <span className="font-medium mr-1">Data:</span>
              {format(new Date(demanda.criado_em), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          )}
          {demanda.problema_descricao && (
            <p>
              <span className="font-medium mr-1">Problema:</span>
              {demanda.problema_descricao}
            </p>
          )}
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleViewNota(demanda.id);
            }}
            className="rounded-xl"
          >
            Ver Nota
          </Button>
          
          {isAdmin && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteDemand(demanda);
              }}
              className="rounded-xl"
            >
              Excluir
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <UnifiedViewContainer
        items={demandas}
        isLoading={isLoading}
        renderListItem={renderDemandaCard}
        renderGridItem={renderDemandaCard}
        idExtractor={(demanda) => demanda.id}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onItemClick={handleViewDemanda}
        filterOptions={{
          primaryFilter: {
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
            placeholder: 'Status'
          },
          secondaryFilter: {
            value: origemFilter,
            onChange: setOrigemFilter,
            options: origensOptions,
            placeholder: 'Origem'
          }
        }}
        emptyStateMessage="Nenhuma demanda encontrada"
        searchPlaceholder="Buscar demandas..."
        defaultViewMode={viewMode}
        gridColumns={{ sm: 1, md: 2, lg: 3 }}
        className="bg-white rounded-xl border border-gray-200"
      />
      
      {/* Delete Demand Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={() => setIsDeleteDialogOpen(false)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Demanda</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              <p className="mb-4">
                Tem certeza que deseja excluir a demanda <strong>"{demandToDelete?.title}"</strong>?
              </p>
              
              {demandToDelete?.hasNotes && (
                <AttentionBox title="Atenção:" className="mb-4">
                  Esta demanda tem notas vinculadas a ela.
                  Ao excluir esta demanda, todas as notas associadas também serão excluídas permanentemente.
                </AttentionBox>
              )}
              
              <p>Esta ação é permanente e não pode ser desfeita.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading} className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteDemand} 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConsultarDemandasContent;
