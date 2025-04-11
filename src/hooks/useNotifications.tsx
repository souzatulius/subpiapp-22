
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AnimatedNotification, { NotificationType } from '@/components/ui/AnimatedNotification';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

interface NotificationsContextType {
  showNotification: (type: NotificationType, title: string, message: string, options?: { duration?: number, autoClose?: boolean }) => void;
  hideNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    options?: { duration?: number; autoClose?: boolean }
  ) => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: options?.duration ?? 5000,
      autoClose: options?.autoClose ?? true
    };

    setNotifications(prev => [...prev, notification]);
    
    return id;
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationsContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      
      {/* Render all active notifications */}
      {notifications.map((notification, index) => (
        <AnimatedNotification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={true}
          duration={notification.duration}
          autoClose={notification.autoClose}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export default useNotifications;
