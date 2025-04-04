
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDepartment = (user: any | null) => {
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserDepartment = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('coordenacao_id')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user department:', error);
        return;
      }
      
      setUserDepartment(data?.coordenacao_id || null);
      setIsLoading(false);
    } catch (e) {
      console.error('Error in getUserDepartment:', e);
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
