
import { useState, useEffect } from 'react';

export const useServiceWorker = () => {
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return {
    serviceWorkerRegistration,
    error,
    waitForServiceWorkerActive
  };
};
