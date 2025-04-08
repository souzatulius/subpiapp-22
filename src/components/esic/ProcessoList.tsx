
import React from 'react';
import ProcessoItem from './ProcessoItem';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface ProcessoListProps {
  user: User | null;
  showAll?: boolean;
  filterStatus?: string;
  searchTerm?: string;
  viewMode?: 'list' | 'cards';
  filterOpen?: boolean;
  setFilterOpen?: (open: boolean) => void;
}

interface Processo {
  id: string;
  texto: string;
  status: string;
  autor_id: string;
  criado_em: string;
  autor: {
    nome_completo: string;
  };
}

const ProcessoList: React.FC<ProcessoListProps> = ({ 
  user, 
  showAll = false,
  filterStatus,
  searchTerm = '',
  viewMode = 'list',
  filterOpen,
  setFilterOpen
}) => {
  const fetchProcessos = async () => {
    try {
      let query = supabase.from('esic_processos');
      
      // Apply filters
      if (!showAll && user) {
        query = query.eq('autor_id', user.id);
      }

      if (filterStatus && filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }

      if (searchTerm) {
        query = query.ilike('texto', `%${searchTerm}%`);
      }

      const { data, error } = await query
        .select('*, autor:usuarios(nome_completo)')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data as Processo[];
    } catch (error) {
      console.error("Error fetching processos:", error);
      throw error;
    }
  };

  const { 
    data: processos, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['esic-processos', showAll, filterStatus, searchTerm], 
    queryFn: fetchProcessos
  });

  const handleDeleteClick = (id: string) => {
    console.log('Delete clicked for processo:', id);
    // In a real implementation, this would show a confirmation dialog 
    // and then delete the processo if confirmed
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-600">
        Erro ao carregar processos: {(error as Error).message}
      </div>
    );
  }

  if (!processos || processos.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Nenhum processo encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {processos.map((processo) => (
        <ProcessoItem 
          key={processo.id} 
          processo={processo} 
          onDeleteClick={() => handleDeleteClick(processo.id)} 
        />
      ))}
    </div>
  );
};

export default ProcessoList;
