
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import DemandasTable from './DemandasTable';
import AttentionBox from '@/components/ui/attention-box';
import { Loader2 } from 'lucide-react';

const ConsultarDemandasContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [origemFilter, setOrigemFilter] = useState('');
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

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      if (origemFilter) {
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
  const handleViewDemanda = (id: string) => {
    navigate(`/dashboard/demandas/${id}`);
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
  const handleDeleteDemand = async (id: string, title: string) => {
    setDemandToDelete({
      id,
      title,
      hasNotes: await checkIfDemandHasNotes(id)
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

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <div className="flex items-center w-full md:w-1/3">
          <Input
            type="search"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-r-none"
          />
          <Button onClick={fetchDemandas} className="rounded-l-none">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2 w-full md:w-2/3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em-andamento">Em Andamento</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="aguardando-nota">Aguardando Nota</SelectItem>
            </SelectContent>
          </Select>

          <Select value={origemFilter} onValueChange={setOrigemFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as origens</SelectItem>
              {origens.map((origem) => (
                <SelectItem key={origem.id} value={origem.id}>
                  {origem.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Demands Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Demandas</h2>
          <p className="text-sm text-gray-500">Listagem de todas as demandas do sistema</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          </div>
        ) : (
          <div className="p-4">
            <DemandasTable 
              demandas={demandas} 
              onViewDemand={handleViewDemanda} 
              onDelete={handleDeleteDemand}
              onViewNota={handleViewNota}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              isAdmin={isAdmin}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
      
      {/* Delete Demand Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={() => setIsDeleteDialogOpen(false)}>
        <AlertDialogContent>
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
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteDemand} 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
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
