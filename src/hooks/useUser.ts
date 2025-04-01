
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/store/useUserStore';

/**
 * Hook to access the current authenticated user
 */
export const useUser = () => {
  const userStore = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Check if we have additional user data in the database
          const { data: userData, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          if (userData) {
            // Combine auth user with database user data
            userStore.setUser({
              id: authUser.id,
              email: authUser.email || '',
              nome_completo: userData.nome_completo,
              coordenacao_id: userData.coordenacao_id,
              status_conta: userData.status_conta,
            });
          } else {
            // Just use the auth user data
            userStore.setUser({
              id: authUser.id,
              email: authUser.email || '',
            });
          }
        } else {
          userStore.setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        userStore.setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchUser();
        } else if (event === 'SIGNED_OUT') {
          userStore.setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user: userStore.user,
    loading,
    isAuthenticated: !!userStore.user,
  };
};
