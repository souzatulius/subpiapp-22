
import { useState, useEffect } from 'react';

export const useUserData = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    // Mock user data for now
    setUser({
      id: '1',
      name: 'User',
      email: 'user@example.com'
    });
    setIsLoadingUser(false);
  }, []);

  return {
    user,
    isLoadingUser,
    setUser
  };
};
