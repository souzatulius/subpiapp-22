import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserData = (userId?: string) => {
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [firstName, setFirstName] = useState<string>('');
  const [userCoordenaticaoId, setUserCoordenaticaoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.warn('useUserData: userId ausente, abortando busca');
        setIsLoadingUser(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            nome_completo,
            coordenacao_id (
              descricao
            )
          `)
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Erro ao buscar dados do usuário:', error.message);
          setIsLoadingUser(false);
          return;
        }

        if (data) {
          setUser(data);
          setUserCoordenaticaoId(data.coordenacao_id?.descricao || null);

          const fullName = data.nome_completo || '';
          const first = fullName.split(' ')[0] || 'Usuário';
          setFirstName(first);
        }
      } catch (error: any) {
        console.error('Erro inesperado em useUserData:', error.message || error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return {
    user,
    isLoadingUser,
    setUser,
    firstName,
    userCoordenaticaoId,
  };
};
