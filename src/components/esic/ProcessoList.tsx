
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
}

const ProcessoList: React.FC<ProcessoListProps> = ({ 
  user, 
  showAll = false,
  filterStatus,
  searchTerm = ''
}) => {
  const fetchProcessos = async () => {
    let query = supabase
      .from('e_sic_processos')
      .select('*, e_sic_andamentos(*)');

    // Apply filters
    if (!showAll && user) {
      query = query.eq('solicitante_id', user.id);
    }

    if (filterStatus && filterStatus !== 'todos') {
      query = query.eq('status', filterStatus);
    }

    if (searchTerm) {
      query = query.ilike('assunto', `%${searchTerm}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  const { 
    data: processos, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['processos', showAll, filterStatus, searchTerm], 
    queryFn: fetchProcessos
  });

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
        <ProcessoItem key={processo.id} processo={processo as any} />
      ))}
    </div>
  );
};

export default ProcessoList;
