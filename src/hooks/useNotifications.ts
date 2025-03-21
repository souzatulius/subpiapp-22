
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { supabase } from '@/integrations/supabase/client';
import { firebaseConfig, vapidKey } from '@/integrations/firebase/config';
import { toast } from '@/components/ui/use-toast';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isNotificationsSupported, setIsNotificationsSupported] = useState<boolean | null>(null);
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register the service worker
  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
          });
          
          console.log('Service Worker registered with scope:', registration.scope);
          setServiceWorkerRegistration(registration);
          
          // Ensure the service worker is active
          if (registration.installing) {
            console.log('Service worker installing');
          } else if (registration.waiting) {
            console.log('Service worker installed but waiting');
          } else if (registration.active) {
            console.log('Service worker active');
          }
        }
      } catch (err: any) {
        console.error('Service Worker registration failed:', err);
        setError(`Erro ao registrar Service Worker: ${err.message}`);
      }
    };

    registerServiceWorker();
  }, []);

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

  // Wait for the service worker to be ready before attempting to get a token
  const waitForServiceWorkerActive = async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Workers não são suportados neste navegador');
    }

    // Check if a service worker is already active
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length > 0) {
      for (const registration of registrations) {
        if (registration.active) {
          console.log('Found active service worker');
          setServiceWorkerRegistration(registration);
          return true;
        }
      }
    }

    // If no active service worker found, register a new one
    try {
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });
      
      setServiceWorkerRegistration(reg);
      
      // If the service worker is installing, wait for it to become active
      if (reg.installing) {
        return new Promise((resolve) => {
          reg.installing?.addEventListener('statechange', (e) => {
            if ((e.target as ServiceWorker).state === 'activated') {
              console.log('Service worker is now active');
              resolve(true);
            }
          });
        });
      } else if (reg.waiting) {
        // Force the waiting service worker to become active
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        return new Promise((resolve) => {
          reg.waiting?.addEventListener('statechange', (e) => {
            if ((e.target as ServiceWorker).state === 'activated') {
              console.log('Service worker is now active after skip waiting');
              resolve(true);
            }
          });
        });
      } else if (reg.active) {
        console.log('Service worker already active');
        return true;
      }
    } catch (err) {
      console.error('Failed to register service worker:', err);
      throw new Error('Falha ao registrar Service Worker');
    }

    return false;
  };

  // Request permission and register token
  const requestPermissionAndRegisterToken = async () => {
    if (!isNotificationsSupported) {
      setError('Notificações não são suportadas neste navegador');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, ensure service worker is active
      console.log('Waiting for service worker to be active...');
      await waitForServiceWorkerActive();
      console.log('Service worker is active, proceeding with permission request');

      const permission = await Notification.requestPermission();
      setNotificationsPermission(permission);

      if (permission !== 'granted') {
        setError('Permissão para notificações negada');
        setIsLoading(false);
        return false;
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
      await saveTokenToDatabase(token);
      
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

      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('Error requesting permission or registering token:', err);
      setError(err.message || 'Erro ao configurar notificações');
      setIsLoading(false);
      return false;
    }
  };

  // Save token to Supabase
  const saveTokenToDatabase = async (token: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const userId = userData.user?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const navegador = getBrowserInfo();

      // Check if token already exists for this user and browser
      const { data: existingTokens, error: fetchError } = await supabase
        .from('tokens_notificacoes')
        .select('id')
        .eq('user_id', userId)
        .eq('navegador', navegador);

      if (fetchError) throw fetchError;

      if (existingTokens && existingTokens.length > 0) {
        // Update existing token
        const { error: updateError } = await supabase
          .from('tokens_notificacoes')
          .update({ fcm_token: token })
          .eq('id', existingTokens[0].id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new token
        const { error: insertError } = await supabase
          .from('tokens_notificacoes')
          .insert({
            user_id: userId,
            fcm_token: token,
            navegador: navegador
          });
          
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (err: any) {
      console.error('Error saving token to database:', err);
      setError(err.message || 'Erro ao salvar token no banco de dados');
      return false;
    }
  };

  // Get browser info
  const getBrowserInfo = (): string => {
    const userAgent = navigator.userAgent;
    let browserName = 'Desconhecido';
    
    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = 'Chrome';
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = 'Firefox';
    } else if (userAgent.match(/safari/i)) {
      browserName = 'Safari';
    } else if (userAgent.match(/opr\//i)) {
      browserName = 'Opera';
    } else if (userAgent.match(/edg/i)) {
      browserName = 'Edge';
    }
    
    return `${browserName} - ${userAgent}`;
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
