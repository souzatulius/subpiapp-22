
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useFirebaseMessaging } from '@/hooks/notifications/useFirebaseMessaging';
import { useTokenManagement } from '@/hooks/notifications/useTokenManagement';

export interface Notification {
  id: string;
  tipo?: string;
  mensagem: string;
  data_envio: string;
  lida: boolean;
  usuario_id?: string;
  referencia_id?: string;
  referencia_tipo?: string;
  metadados?: Record<string, any>;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission>('default');
  const [isNotificationsSupported, setIsNotificationsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastFetchRef = useRef<number>(0);
  
  const {
    fcmToken,
    isNotificationsSupported: firebaseSupported,
    notificationsPermission: firebasePermission,
    requestPermissionAndGetToken,
    error: firebaseError
  } = useFirebaseMessaging();
  
  const { saveTokenToDatabase } = useTokenManagement();
  
  // Sincronizar estado da permissão com o que vem do Firebase
  useEffect(() => {
    setIsNotificationsSupported(firebaseSupported || false);
    if (firebasePermission) {
      setNotificationsPermission(firebasePermission);
    }
  }, [firebaseSupported, firebasePermission]);
  
  // Check browser notifications support
  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setIsNotificationsSupported(true);
      setNotificationsPermission(Notification.permission);
    }
  }, []);
  
  // Fetch unread count for badge
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);
  
  const fetchUnreadCount = async () => {
    // Prevent multiple fetches close together
    const now = Date.now();
    if (now - lastFetchRef.current < 5000) return; // Don't fetch if less than 5 seconds passed
    
    lastFetchRef.current = now;
    
    try {
      const { count, error } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', user?.id)
        .eq('lida', false)
        .eq('excluida', false);
      
      if (error) throw error;
      
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };
  
  // Request permission and register token
  const requestPermissionAndRegisterToken = useCallback(async (): Promise<boolean> => {
    if (!user || !isNotificationsSupported) return false;
    
    try {
      setIsLoading(true);
      
      // Request permission and get token from Firebase
      const token = await requestPermissionAndGetToken();
      
      if (!token) {
        return false;
      }
      
      // Save token to the database
      const success = await saveTokenToDatabase(token);
      
      // Fetch the unread count after registering
      fetchUnreadCount();
      
      return success;
    } catch (error) {
      console.error('Error registering for notifications:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, isNotificationsSupported, requestPermissionAndGetToken, saveTokenToDatabase]);
  
  // Check for notifications updates frequently when in focus
  useEffect(() => {
    if (!user) return;
    
    // Set up subscription to notificacoes table for real-time updates
    const channel = supabase
      .channel('notification-count')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events
          schema: 'public',
          table: 'notificacoes',
          filter: `usuario_id=eq.${user.id}`
        },
        (payload) => {
          // Update unread count whenever notifications change
          fetchUnreadCount();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  return {
    notificationsPermission,
    isNotificationsSupported,
    requestPermissionAndRegisterToken,
    isLoading,
    fcmToken,
    unreadCount
  };
};
