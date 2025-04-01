
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';

export const useAdminCheck = () => {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      // Simple check - in a real app, you might want to check roles or permissions
      // from your user data or make an API call
      setIsAdmin(user.email?.includes('admin') || false);
    }
  }, [user]);

  return { isAdmin };
};
