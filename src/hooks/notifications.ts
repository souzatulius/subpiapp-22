
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

export interface Notification {
  id: string;
  tipo?: string;
  mensagem: string;
  data_envio: string;
  lida: boolean;
  usuario_id?: string;
  referencia_id?: string;
  referencia_tipo?: string;
  metadados?: any;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission>('default');
  const [isNotificationsSupported, setIsNotificationsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setIsNotificationsSupported(true);
      setNotificationsPermission(Notification.permission);
    }
  }, []);
  
  const requestPermissionAndRegisterToken = useCallback(async (): Promise<boolean> => {
    if (!user || !('Notification' in window)) return false;
    
    try {
      setIsLoading(true);
      
      // Request permission
      const permission = await Notification.requestPermission();
      setNotificationsPermission(permission);
      
      if (permission !== 'granted') {
        return false;
      }
      
      // Create a mock token for now
      // In a real implementation, you'd use a service like Firebase for real device tokens
      const mockToken = `browser-${Math.random().toString(36).substring(2, 15)}`;
      
      // Save token to Supabase
      const { error } = await supabase
        .from('tokens_notificacoes')
        .upsert({
          user_id: user.id,
          fcm_token: mockToken,
          navegador: navigator.userAgent,
          criado_em: new Date().toISOString()
        }, { onConflict: 'user_id,fcm_token' });
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Erro ao registrar token de notificação:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  return {
    notificationsPermission,
    isNotificationsSupported,
    requestPermissionAndRegisterToken,
    isLoading
  };
};
