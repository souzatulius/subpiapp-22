
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useDepartmentData = () => {
  const { user } = useAuth();
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isComunicacao, setIsComunicacao] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchUserDepartment = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user department:', error);
          setIsLoading(false);
          return;
        }
        
        if (data) {
          setUserDepartment(data.coordenacao_id);
          setIsComunicacao(data.coordenacao_id === 'comunicacao');
        }
      } catch (error) {
        console.error('Failed to fetch user department:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserDepartment();
  }, [user]);

  return {
    userDepartment,
    isComunicacao,
    isLoading
  };
};
