
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserData = (userId?: string) => {
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setIsLoadingUser(false);
        return;
      }

      try {
        // Fetch from the correct 'usuarios' table
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome_completo')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          setIsLoadingUser(false);
          return;
        }

        if (data) {
          setUser(data);
          // Extract first name from full name
          const fullName = data.nome_completo || '';
          const firstName = fullName.split(' ')[0] || 'Usuário';
          setFirstName(firstName);
        }
      } catch (error) {
        console.error('Error in useUserData:', error);
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
    firstName
  };
};
