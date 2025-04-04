import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDepartment = (user: any | null) => {
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserDepartment = useCallback(async () => {
    if (!user) return;

    try {
      // 1. Busca o ID da coordenação do usuário
      const { data: usuarioData, error: userError } = await supabase
        .from('usuarios')
        .select('coordenacao_id')
        .eq('id', user.id)
        .single();

      if (userError || !usuarioData?.coordenacao_id) {
        console.error('Erro ao buscar coordenacao_id do usuário:', userError);
        setIsLoading(false);
        return;
      }

      // 2. Busca a descrição da coordenação com base no ID
      const { data: coordData, error: coordError } = await supabase
        .from('coordenacoes')
        .select('descricao')
        .eq('id', usuarioData.coordenacao_id)
        .single();

      if (coordError || !coordData?.descricao) {
        console.error('Erro ao buscar descrição da coordenação:', coordError);
        setIsLoading(false);
        return;
      }

      // 3. Define o nome da coordenação como valor final
      setUserDepartment(coordData.descricao);
    } catch (e) {
      console.error('Erro geral em getUserDepartment:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    getUserDepartment();
  }, [user, getUserDepartment]);

  return { userDepartment, isLoading };
};
