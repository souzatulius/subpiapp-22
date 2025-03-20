
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUserId(data.user.id);
        console.log('Current user ID:', data.user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  return { currentUserId };
};
