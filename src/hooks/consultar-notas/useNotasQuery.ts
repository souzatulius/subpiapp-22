
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { startOfDay, endOfDay, isAfter, isBefore, isEqual } from 'date-fns';
import { useCurrentUser } from '@/components/settings/access-control/hooks/useCurrentUser';
import { NotaOficial, NotaEdicao } from '@/types/nota';

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
            id,
            titulo,
            texto,
            status,
            criado_em,
            atualizado_em,
            autor_id,
            aprovador_id,
            supervisao_tecnica_id,
            demanda_id,
            problema_id,
            autor:autor_id(id, nome_completo),
            aprovador:aprovador_id(id, nome_completo),
            supervisao_tecnica:supervisao_tecnica_id(id, descricao),
            historico_edicoes:notas_historico_edicoes(
              id,
              nota_id,
              texto_anterior,
              texto_novo,
              titulo_anterior,
              titulo_novo,
              editor_id,
              criado_em,
              editor:editor_id(id, nome_completo)
            )
          `)
          .neq('status', 'excluida'); // Ignorar notas excluídas

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        if (areaFilter !== 'all') {
          query = query.eq('supervisao_tecnica_id', areaFilter);
        }

        query = query.order('criado_em', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        // Format the data to ensure type safety
        const formattedNotas = (data || []).map(nota => {
          // Process historic edits to ensure the type is correct
          const processedHistorico = (nota.historico_edicoes || []).map(edit => {
            // Handle potential error in editor relationship
            const editor = typeof edit.editor === 'object' && !('error' in edit.editor) 
              ? edit.editor 
              : { id: '', nome_completo: 'Não informado' };
            
            return {
              ...edit,
              editor
            };
          }) as NotaEdicao[];
          
          // Handle potential error in relationships
          const autor = typeof nota.autor === 'object' && !('error' in nota.autor)
            ? nota.autor
            : { id: '', nome_completo: 'Não informado' };
            
          const aprovador = typeof nota.aprovador === 'object' && !('error' in nota.aprovador)
            ? nota.aprovador
            : { id: '', nome_completo: 'Não informado' };
            
          const supervisao_tecnica = typeof nota.supervisao_tecnica === 'object' && !('error' in nota.supervisao_tecnica)
            ? nota.supervisao_tecnica
            : { id: '', descricao: 'Não informada' };
          
          return {
            ...nota,
            autor,
            aprovador,
            supervisao_tecnica,
            historico_edicoes: processedHistorico
          };
        }) as NotaOficial[];

        return formattedNotas;
      } catch (error: any) {
        console.error('Erro ao carregar notas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as notas',
          variant: 'destructive',
        });
        return [] as NotaOficial[];
      }
    },
    staleTime: 30000, // 30 segundos antes de considerar dados obsoletos
    gcTime: 300000 // Cache por 5 minutos (renamed from cacheTime)
  });

  const filteredNotas = notas.filter(nota => {
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      if (!(
        nota.titulo?.toLowerCase().includes(searchLower) ||
        nota.texto?.toLowerCase().includes(searchLower) ||
        nota.autor?.nome_completo?.toLowerCase().includes(searchLower) ||
        nota.supervisao_tecnica?.descricao?.toLowerCase().includes(searchLower) ||
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
