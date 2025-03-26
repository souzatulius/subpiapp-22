
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { NotaOficial, NotaEdicao } from '@/types/nota';

export interface UseNotasQueryResult {
  notas: NotaOficial[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  deleteNota: (id: string) => Promise<void>;
  approveNota: (id: string) => Promise<void>;
  rejectNota: (id: string) => Promise<void>;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  selectedNota: NotaOficial | null;
  setSelectedNota: (nota: NotaOficial | null) => void;
  isApproveModalOpen: boolean;
  setIsApproveModalOpen: (open: boolean) => void;
  formatNotaInfo: (nota: NotaOficial | null) => any;
  formatNotaHistory: (nota: NotaOficial | null) => any[];
  // Add the missing properties needed by useNotasData
  filteredNotas: NotaOficial[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
  dataInicioFilter: Date | undefined;
  setDataInicioFilter: (date: Date | undefined) => void;
  dataFimFilter: Date | undefined;
  setDataFimFilter: (date: Date | undefined) => void;
  formatDate: (dateStr: string) => string;
  isAdmin: boolean;
}

// Function to format timestamp
function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const useNotasQuery = (status?: string, searchTerm?: string): UseNotasQueryResult => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  
  // Added state for useNotasData compatibility
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [dataInicioFilter, setDataInicioFilter] = useState<Date | undefined>(undefined);
  const [dataFimFilter, setDataFimFilter] = useState<Date | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(true); // Default to true for now
  const [filteredNotas, setFilteredNotas] = useState<NotaOficial[]>([]);

  const {
    data: notas,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notas', status, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id (nome_completo),
          aprovador:aprovador_id (nome_completo),
          supervisao_tecnica:supervisao_tecnica_id (descricao),
          demanda:demanda_id (titulo),
          problema:problema_id (descricao)
        `)
        .order('criado_em', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (searchTerm) {
        query = query.ilike('titulo', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Add area_coordenacao property to match NotaOficial type
      const formattedData = (data || []).map(nota => ({
        ...nota,
        area_coordenacao: {
          id: nota.supervisao_tecnica_id || '',
          descricao: nota.supervisao_tecnica?.descricao || 'Não informada'
        }
      })) as NotaOficial[];

      return formattedData;
    }
  });

  // Update filtered notas when primary data changes
  useEffect(() => {
    if (notas) {
      setFilteredNotas(notas);
    }
  }, [notas]);

  const deleteNotaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Sucesso!',
        description: 'Nota excluída com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['notas', status, searchTerm] });
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro!',
        description: `Erro ao excluir nota: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const approveNotaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .update({ status: 'aprovada', aprovador_id: user?.id })
        .eq('id', id)
        .select();
  
      if (error) {
        throw error;
      }
  
      return data ? data[0] : null;
    },
    onSuccess: () => {
      toast({
        title: 'Sucesso!',
        description: 'Nota aprovada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['notas', status] });
      setIsApproveModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro!',
        description: `Erro ao aprovar nota: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const rejectNotaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .update({ status: 'rejeitada', aprovador_id: user?.id })
        .eq('id', id)
        .select();
  
      if (error) {
        throw error;
      }
  
      return data ? data[0] : null;
    },
    onSuccess: () => {
      toast({
        title: 'Sucesso!',
        description: 'Nota rejeitada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['notas', status] });
      setIsApproveModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro!',
        description: `Erro ao rejeitar nota: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteNota = async (id: string) => {
    try {
      await deleteNotaMutation.mutateAsync(id);
    } catch (error: any) {
      toast({
        title: 'Erro!',
        description: `Erro ao excluir nota: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const approveNota = async (id: string) => {
    try {
      await approveNotaMutation.mutateAsync(id);
    } catch (error: any) {
      toast({
        title: 'Erro!',
        description: `Erro ao aprovar nota: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const rejectNota = async (id: string) => {
    try {
      await rejectNotaMutation.mutateAsync(id);
    } catch (error: any) {
      toast({
        title: 'Erro!',
        description: `Erro ao rejeitar nota: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Format the note history for display
  const formatNotaHistory = (nota: NotaOficial | null) => {
    if (!nota || !nota.historico_edicoes || nota.historico_edicoes.length === 0) return [];

    return nota.historico_edicoes.map((edit) => {
      return {
        id: edit.id,
        date: formatDate(edit.criado_em),
        editor: edit.editor?.nome_completo || "Usuário Desconhecido",
        titleChanged: edit.titulo_anterior !== edit.titulo_novo,
        oldTitle: edit.titulo_anterior,
        newTitle: edit.titulo_novo,
        textChanged: edit.texto_anterior !== edit.texto_novo,
      };
    });
  };

  // Format note information for display
  const formatNotaInfo = (nota: NotaOficial | null) => {
    if (!nota) return null;
    
    return {
      id: nota.id,
      title: nota.titulo,
      text: nota.texto,
      status: nota.status,
      createdAt: formatDate(nota.criado_em),
      updatedAt: formatDate(nota.atualizado_em),
      author: nota.autor?.nome_completo || "Usuário Desconhecido",
      approver: nota.aprovador?.nome_completo || "Não aprovado",
      problem: nota.problema?.descricao || "Não especificado",
      supervision: nota.supervisao_tecnica?.descricao || "Não especificada",
      demand: nota.demanda?.titulo || "Não associada a demanda",
      history: formatNotaHistory(nota)
    };
  };

  return {
    notas: notas || [],
    filteredNotas: filteredNotas,
    loading,
    isLoading: loading,
    error,
    refetch,
    deleteNota,
    approveNota,
    rejectNota,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedNota,
    setSelectedNota,
    isApproveModalOpen,
    setIsApproveModalOpen,
    formatNotaInfo,
    formatNotaHistory,
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
    isAdmin
  };
};
