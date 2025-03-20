
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useAdminCheck = (user: User | null) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const checkAdminStatus = async () => {
        try {
          // Check if user has admin privileges
          const { data, error } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (error) throw error;
          setIsAdmin(!!data);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      };
      
      checkAdminStatus();
    }
  }, [user]);

  return { isAdmin };
};
