
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { startOfDay, endOfDay, isAfter, isBefore, isEqual } from 'date-fns';
import { useCurrentUser } from '@/components/settings/access-control/hooks/useCurrentUser';
import { NotaOficial } from './types';

export const useNotasQuery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [dataInicioFilter, setDataInicioFilter] = useState<Date | undefined>(undefined);
  const [dataFimFilter, setDataFimFilter] = useState<Date | undefined>(undefined);
  const { currentUserId } = useCurrentUser();
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar se o usuário atual é admin
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!currentUserId) return;
      
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: currentUserId });
        
      if (!error && data) {
        setIsAdmin(data);
      }
    };
    
    checkIfAdmin();
  }, [currentUserId]);

  const { data: notas = [], isLoading, refetch } = useQuery({
    queryKey: ['notas', statusFilter, areaFilter, dataInicioFilter, dataFimFilter, isAdmin],
    queryFn: async () => {
      try {
        let query = supabase
          .from('notas_oficiais')
          .select(`
            *,
            autor:autor_id(id, nome_completo),
            aprovador:aprovador_id(id, nome_completo),
            area_coordenacao:area_coordenacao_id(id, descricao)
          `)
          .neq('status', 'excluida') // Ignorar notas excluídas
          .order('criado_em', { ascending: false });

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        if (areaFilter !== 'all') {
          query = query.eq('area_coordenacao_id', areaFilter);
        }

        const { data, error } = await query;

        if (error) throw error;

        return (data || []).map(nota => ({
          ...nota,
          autor: nota.autor || { id: '', nome_completo: 'Não informado' },
          area_coordenacao: nota.area_coordenacao || { id: '', descricao: 'Não informada' }
        })) as NotaOficial[];
      } catch (error: any) {
        console.error('Erro ao carregar notas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as notas',
          variant: 'destructive',
        });
        return [];
      }
    },
    staleTime: 30000, // 30 segundos antes de considerar dados obsoletos
    cacheTime: 300000 // Cache por 5 minutos
  });

  const filteredNotas = notas.filter(nota => {
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      if (!(
        nota.titulo?.toLowerCase().includes(searchLower) ||
        nota.texto?.toLowerCase().includes(searchLower) ||
        nota.autor?.nome_completo?.toLowerCase().includes(searchLower) ||
        nota.area_coordenacao?.descricao?.toLowerCase().includes(searchLower) ||
        nota.status?.toLowerCase().includes(searchLower)
      )) {
        return false;
      }
    }

    if (dataInicioFilter) {
      const notaDate = new Date(nota.criado_em);
      const startDate = startOfDay(dataInicioFilter);
      if (isBefore(notaDate, startDate) && !isEqual(notaDate, startDate)) {
        return false;
      }
    }

    if (dataFimFilter) {
      const notaDate = new Date(nota.criado_em);
      const endDate = endOfDay(dataFimFilter);
      if (isAfter(notaDate, endDate) && !isEqual(notaDate, endDate)) {
        return false;
      }
    }

    return true;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Data não informada';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'Data inválida';
    }
  };

  return {
    notas,
    filteredNotas,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
    dataInicioFilter,
    setDataInicioFilter,
    dataFimFilter,
    setDataFimFilter,
    formatDate,
    refetch,
    isAdmin
  };
};
