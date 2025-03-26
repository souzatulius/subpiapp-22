
import { useState } from 'react';
import { useAuthState } from './auth/useAuthState';
import { useAuthActions } from './auth/useAuthActions';

/**
 * Main authentication hook that combines state and actions
 */
export const useAuth = () => {
  const [localError, setLocalError] = useState<Error | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  
  // Get authentication state
  const authState = useAuthState();
  
  // Set up auth actions with state change handler
  const authActions = useAuthActions({
    onAuthStateChange: (isLoading, error) => {
      setLocalLoading(isLoading);
      setLocalError(error);
    }
  });

  // Combine state and actions
  return {
    ...authState,
    ...authActions,
    // Override loading and error with local state when actions are in progress
    isLoading: authState.isLoading || localLoading,
    loading: authState.isLoading || localLoading,
    error: localError || authState.error,
  };
};
