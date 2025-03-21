
// Firebase Cloud Messaging Service Worker

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAhAVGcAMd18_J3kppJo90uKiUDh1RmEZY",
  authDomain: "subpi-79cc7.firebaseapp.com",
  projectId: "subpi-79cc7",
  storageBucket: "subpi-79cc7.firebasestorage.app",
  messagingSenderId: "211336797639",
  appId: "1:211336797639:web:6991f672b8e5cf3241cde2"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title || 'Nova notificação';
  const notificationOptions = {
    body: payload.notification.body || 'Você recebeu uma nova notificação',
    icon: '/lovable-uploads/d4df5a3e-a086-485b-8ba6-b4d4fdc22bbf.png',
    badge: '/lovable-uploads/d4df5a3e-a086-485b-8ba6-b4d4fdc22bbf.png',
    tag: 'notification',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);
  
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes('/dashboard') && 'focus' in client) {
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow('/dashboard');
        }
      })
  );
});
