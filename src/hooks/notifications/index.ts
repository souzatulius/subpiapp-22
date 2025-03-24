
import { useState } from 'react';
import { useFirebaseMessaging } from './useFirebaseMessaging';
import { useTokenManagement } from './useTokenManagement';

export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    fcmToken,
    isNotificationsSupported,
    notificationsPermission,
    requestPermissionAndGetToken,
  } = useFirebaseMessaging();
  
  const { saveTokenToDatabase } = useTokenManagement();

  // Request permission and register token
  const requestPermissionAndRegisterToken = async () => {
    if (!isNotificationsSupported) {
      setError('Notificações não são suportadas neste navegador');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await requestPermissionAndGetToken();
      
      if (!token) {
        setIsLoading(false);
        return false;
      }
      
      const success = await saveTokenToDatabase(token);
      setIsLoading(false);
      return success;
    } catch (err: any) {
      console.error('Error in requestPermissionAndRegisterToken:', err);
      setError(err.message || 'Erro ao configurar notificações');
      setIsLoading(false);
      return false;
    }
  };

  return {
    isNotificationsSupported,
    notificationsPermission,
    fcmToken,
    isLoading,
    error,
    requestPermissionAndRegisterToken
  };
};

export * from './useFirebaseMessaging';
export * from './useServiceWorker';
export * from './useTokenManagement';
