import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { NotaOficial } from '@/types/nota';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useNotasData = (): UseNotasDataReturn => {
  const [notas, setNotas] = useState<NotaOficial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotas, setFilteredNotas] = useState<NotaOficial[]>([]);
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { session, user } = useAuth();

  const fetchNotas = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!session || !user) {
        console.log("Usuário não autenticado ao tentar carregar notas");
        return;
      }

      console.log("Carregando notas como usuário:", user.id);

      const { data, error } = await supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id (id, nome_completo),
          aprovador:aprovador_id (id, nome_completo),
          problema:problema_id (
            id, 
            descricao,
            coordenacao:coordenacao_id (
              id, 
              descricao
            )
          ),
          demanda:demanda_id (id, titulo)
        `)
        .order('criado_em', { ascending: false });
        
      if (error) {
        console.error("Erro ao carregar notas:", error);
        setError(error);
        toast({
          title: "Erro ao carregar notas",
          description: "Não foi possível carregar as notas oficiais.",
          variant: "destructive"
        });
        return;
      }

      console.log(`${data?.length || 0} notas carregadas`);
      setNotas(data as NotaOficial[]);
    } catch (err: any) {
      setError(err);
      toast({
        title: "Erro inesperado",
        description: err.message || "Ocorreu um erro ao carregar as notas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, [session, user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNotas(notas);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = notas.filter(nota => {
      const matchTitle = nota.titulo.toLowerCase().includes(lowerSearchTerm);
      const matchContent = nota.conteudo.toLowerCase().includes(lowerSearchTerm);
      const matchAutor = nota.autor?.nome_completo?.toLowerCase().includes(lowerSearchTerm);
      const matchProblema = nota.problema?.descricao?.toLowerCase().includes(lowerSearchTerm);
      const matchDemanda = nota.demanda?.titulo?.toLowerCase().includes(lowerSearchTerm);

      return matchTitle || matchContent || matchAutor || matchProblema || matchDemanda;
    });

    setFilteredNotas(filtered);
  }, [searchTerm, notas]);

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setNotas(notas.filter(nota => nota.id !== id));
      setFilteredNotas(filteredNotas.filter(nota => nota.id !== id));
      toast({
        title: "Nota oficial excluída",
        description: "A nota foi removida com sucesso."
      });
    } catch (err: any) {
      toast({
        title: "Erro ao excluir nota",
        description: err.message || "Ocorreu um erro ao excluir a nota.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return {
    notas,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredNotas,
    selectedNota,
    setSelectedNota,
    isDetailOpen, 
    setIsDetailOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteLoading,
    handleDelete,
    refetch
  };
};
