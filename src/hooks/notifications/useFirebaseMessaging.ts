
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { toast } from '@/components/ui/use-toast';
import { firebaseConfig, vapidKey } from '@/integrations/firebase/config';
import { useServiceWorker } from './useServiceWorker';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const useFirebaseMessaging = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isNotificationsSupported, setIsNotificationsSupported] = useState<boolean | null>(null);
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { serviceWorkerRegistration, waitForServiceWorkerActive } = useServiceWorker();

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
        
        // Display notification using toast
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

  return {
    fcmToken,
    isNotificationsSupported,
    notificationsPermission,
    isLoading,
    error,
    requestPermissionAndGetToken,
    setIsLoading,
    setError
  };
};
