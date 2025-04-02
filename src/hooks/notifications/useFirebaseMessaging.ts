
import { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { toast } from '@/components/ui/use-toast';
import { firebaseConfig, vapidKey } from '@/integrations/firebase/config';
import { useServiceWorker } from './useServiceWorker';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const useFirebaseMessaging = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isNotificationsSupported, setIsNotificationsSupported] = useState<boolean | null>(null);
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { serviceWorkerRegistration, waitForServiceWorkerActive } = useServiceWorker();
  const { user } = useAuth();

  // Check if notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const isFirebaseSupported = await isSupported();
        setIsNotificationsSupported(isFirebaseSupported && 'Notification' in window && 'serviceWorker' in navigator);
      } catch (err) {
        console.error('Error checking notification support:', err);
        setIsNotificationsSupported(false);
      }
    };

    checkSupport();
  }, []);

  // Check notification permission
  useEffect(() => {
    if (isNotificationsSupported) {
      setNotificationsPermission(Notification.permission);
    }
  }, [isNotificationsSupported]);

  // Setup message listener to receive notifications from service worker
  useEffect(() => {
    if (!navigator.serviceWorker || !navigator.serviceWorker.addEventListener) return;

    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SILENT_NOTIFICATION') {
        console.log('Silent notification received from service worker:', event.data.payload);
        
        // Handle silent notification (update UI, refresh data, etc.)
        if (event.data.payload.notificacaoId) {
          // Fetch the notification data if needed
          fetchNotificationDetails(event.data.payload.notificacaoId)
            .then(notificationData => {
              if (notificationData) {
                // Show a toast notification
                toast({
                  title: notificationData.mensagem?.substring(0, 30) || 'Nova notificação',
                  description: notificationData.mensagem,
                  duration: 5000,
                });
              }
            })
            .catch(err => console.error('Error fetching notification details:', err));
        }
      }
    };

    // Add the event listener
    navigator.serviceWorker.addEventListener('message', messageHandler);

    // Cleanup
    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    };
  }, []);

  // Fetch notification details from the database
  const fetchNotificationDetails = async (notificationId: string) => {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('id', notificationId)
        .single();
      
      if (error) throw error;
      
      // Add title property if it doesn't exist
      if (data && !data.title) {
        data.title = data.mensagem?.substring(0, 30) || 'Nova notificação';
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching notification details:', err);
      return null;
    }
  };

  // Request permission and get FCM token
  const requestPermissionAndGetToken = async (): Promise<string | null> => {
    if (!isNotificationsSupported) {
      setError('Notificações não são suportadas neste navegador');
      return null;
    }

    try {
      // First, ensure service worker is active
      console.log('Waiting for service worker to be active...');
      await waitForServiceWorkerActive();
      console.log('Service worker is active, proceeding with permission request');

      const permission = await Notification.requestPermission();
      setNotificationsPermission(permission);

      if (permission !== 'granted') {
        setError('Permissão para notificações negada');
        return null;
      }

      const messaging = getMessaging(app);
      
      console.log('Requesting FCM token with vapid key:', vapidKey);
      const token = await getToken(messaging, { 
        vapidKey,
        serviceWorkerRegistration: serviceWorkerRegistration || undefined
      });
      
      if (!token) {
        throw new Error('Não foi possível obter o token FCM');
      }
      
      console.log('FCM token obtained:', token);
      setFcmToken(token);
      
      // Set up foreground message handler
      onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        
        // Check if this is a silent notification
        if (payload.data && payload.data.silent === 'true') {
          console.log('Silent notification received in foreground');
          
          // Handle silent notification (update UI, refresh data, etc.)
          if (payload.data.notificacaoId) {
            fetchNotificationDetails(payload.data.notificacaoId)
              .then(notificationData => {
                if (notificationData) {
                  // Show a toast notification
                  toast({
                    title: notificationData.mensagem?.substring(0, 30) || 'Nova notificação',
                    description: notificationData.mensagem,
                    duration: 5000,
                  });
                }
              })
              .catch(err => console.error('Error fetching notification details:', err));
          }
          
          return;
        }
        
        // Display regular notification using toast
        toast({
          title: payload.notification?.title || 'Nova notificação',
          description: payload.notification?.body,
          duration: 5000,
        });
      });

      return token;
    } catch (err: any) {
      console.error('Error requesting permission or registering token:', err);
      setError(err.message || 'Erro ao configurar notificações');
      return null;
    }
  };

  // Send a sync request to the service worker
  const syncNotifications = useCallback(() => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_NOTIFICATIONS',
        userId: user?.id,
      });
    }
  }, [user]);

  return {
    fcmToken,
    isNotificationsSupported,
    notificationsPermission,
    isLoading,
    error,
    requestPermissionAndGetToken,
    syncNotifications,
    setIsLoading,
    setError
  };
};
