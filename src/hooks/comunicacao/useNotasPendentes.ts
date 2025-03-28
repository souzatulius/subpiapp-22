
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface NotaPendente {
  id: string;
  titulo: string;
  criado_em: string;
  autor_id: string;
  autor: {
    nome_completo: string;
  };
}

export const useNotasPendentes = () => {
  const [notasPendentes, setNotasPendentes] = useState<NotaPendente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotasPendentes = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select(`
            id,
            titulo,
            criado_em,
            autor_id,
            autor:autor_id (nome_completo)
          `)
          .eq('status', 'pendente')
          .order('criado_em', { ascending: false })
          .limit(5);

        if (error) throw error;
        
        if (data) {
          setNotasPendentes(data as NotaPendente[]);
        }
      } catch (error) {
        console.error('Erro ao carregar notas pendentes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotasPendentes();

    // Set up real-time subscription for pending notes
    const subscription = supabase
      .channel('notas_oficiais_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notas_oficiais',
          filter: 'status=eq.pendente'
        }, 
        () => {
          fetchNotasPendentes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { notasPendentes, isLoading };
};
