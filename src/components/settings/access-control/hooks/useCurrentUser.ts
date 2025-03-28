
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useCurrentUser = () => {
  const { user } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
    } else {
      setCurrentUserId(null);
    }
  }, [user]);
  
  return { currentUserId };
};
