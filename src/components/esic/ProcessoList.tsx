
import React, { useState, useEffect } from 'react';
import ProcessoItem from './ProcessoItem';
import ProcessoCard from './ProcessoCard';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import DeleteProcessoDialog from './dialogs/DeleteProcessoDialog';
import { useAuth } from '@/hooks/useSupabaseAuth';
import FilterDialog from '@/components/shared/FilterDialog';

interface ProcessoListProps {
  viewMode: 'list' | 'cards';
  searchTerm: string;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

interface Processo {
  id: number | string;
  numero_processo: string;
  titulo: string;
  categoria?: string;
  status: string;
  created_at: string;
  prazo?: string;
  solicitante: string;
}

const ProcessoList: React.FC<ProcessoListProps> = ({ 
  viewMode,
  searchTerm,
  filterOpen,
  setFilterOpen
}) => {
  const { user } = useAuth();
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processoToDelete, setProcessoToDelete] = useState<Processo | null>(null);
  const [filters, setFilters] = useState({
    status: [] as string[],
    category: [] as string[],
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined }
  });

  useEffect(() => {
    fetchProcessos();
  }, [searchTerm, filters]);

  const fetchProcessos = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('esic_processos')
        .select('*');
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,numero_processo.ilike.%${searchTerm}%`);
      }
      
      // Apply status filter
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      
      // Apply category filter
      if (filters.category && filters.category.length > 0) {
        query = query.in('categoria', filters.category);
      }
      
      // Apply date filter
      if (filters.dateRange.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }
      if (filters.dateRange.to) {
        query = query.lte('created_at', filters.dateRange.to.toISOString());
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProcessos(data || []);
    } catch (error) {
      console.error('Error fetching processos:', error);
      // Fallback to mock data
      setProcessos([
        {
          id: 1,
          numero_processo: 'ESIC-2023-001',
          titulo: 'Solicitação de informações sobre licitações',
          categoria: 'Financeiro',
          status: 'Em análise',
          created_at: '2023-10-15T14:30:00',
          prazo: '2023-10-30T23:59:59',
          solicitante: 'João Silva',
        },
        {
          id: 2,
          numero_processo: 'ESIC-2023-002',
          titulo: 'Dados sobre obras públicas',
          categoria: 'Obras',
          status: 'Concluído',
          created_at: '2023-10-10T09:15:00',
          prazo: '2023-10-25T23:59:59',
          solicitante: 'Maria Souza',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (processo: Processo) => {
    setProcessoToDelete(processo);
    setDeleteDialogOpen(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleDeleteConfirm = async () => {
    if (!processoToDelete) return;
    
    try {
      const { error } = await supabase
        .from('esic_processos')
        .delete()
        .eq('id', processoToDelete.id);
        
      if (error) throw error;
      
      setProcessos(processos.filter(p => p.id !== processoToDelete.id));
    } catch (error) {
      console.error('Error deleting processo:', error);
    } finally {
      setDeleteDialogOpen(false);
      setProcessoToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 mt-4">
        <div className="flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-blue-600">Carregando processos...</span>
        </div>
      </Card>
    );
  }

  if (processos.length === 0) {
    return (
      <Card className="p-8 mt-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800">Nenhum processo encontrado</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm 
              ? `Não foram encontrados processos com o termo "${searchTerm}"`
              : 'Não há processos cadastrados ou que correspondam aos filtros aplicados'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {viewMode === 'list' ? (
        <Card className="overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processos.map((processo) => (
                  <ProcessoItem 
                    key={processo.id} 
                    processo={processo} 
                    onDeleteClick={() => handleDeleteClick(processo)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {processos.map((processo) => (
            <ProcessoCard 
              key={processo.id} 
              processo={processo} 
              onDeleteClick={() => handleDeleteClick(processo)}
            />
          ))}
        </div>
      )}
      
      <DeleteProcessoDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
      
      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        options={{
          status: [
            { value: 'Em análise', label: 'Em análise' },
            { value: 'Concluído', label: 'Concluído' },
            { value: 'Aguardando complemento', label: 'Aguardando complemento' },
            { value: 'Negado', label: 'Negado' },
          ],
          category: [
            { value: 'Financeiro', label: 'Financeiro' },
            { value: 'Obras', label: 'Obras' },
            { value: 'Administrativo', label: 'Administrativo' },
            { value: 'Outros', label: 'Outros' },
          ]
        }}
        showDateFilter
      />
    </>
  );
};

export default ProcessoList;
