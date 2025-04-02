
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { useFirebaseMessaging } from '@/hooks/notifications/useFirebaseMessaging';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const deletedIdsRef = useRef<Set<string>>(new Set());
  const { syncNotifications } = useFirebaseMessaging();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('excluida', false)
        .order('data_envio', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Filter out any notifications that have been deleted locally
      const filteredData = (data || []).filter(notification => 
        !deletedIdsRef.current.has(notification.id)
      );

      // Ensure each notification has a tipo property with a default value
      const processedNotifications = filteredData.map(notification => ({
        ...notification,
        tipo: notification.tipo || 'comunicado', // Default to 'comunicado' if tipo is missing
        referencia_tipo: notification.referencia_tipo || null,
        metadados: notification.metadados || null
      })) as Notification[];

      setNotifications(processedNotifications);
      setUnreadCount(processedNotifications.filter(n => !n.lida).length || 0);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Inicializa a inscrição Realtime quando o usuário estiver autenticado
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Subscribe to changes in the notifications table for this user
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'notificacoes',
          filter: `usuario_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification change received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // Add the new notification to the list
            const newNotification = payload.new as Notification;
            
            // Only add if it wasn't deleted locally
            if (!deletedIdsRef.current.has(newNotification.id)) {
              setNotifications(prevNotifications => [
                newNotification,
                ...prevNotifications.filter(n => n.id !== newNotification.id)
              ]);
              
              if (!newNotification.lida) {
                setUnreadCount(prev => prev + 1);
              }
              
              // Show a toast for the new notification
              toast({
                title: `Nova ${newNotification.tipo || 'notificação'}`,
                description: newNotification.mensagem,
                duration: 5000,
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            // Update the notification in the list
            const updatedNotification = payload.new as Notification;
            
            setNotifications(prevNotifications => 
              prevNotifications.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
            
            // Update unread count if the lida status changed
            if (payload.old.lida !== updatedNotification.lida) {
              setUnreadCount(prev => 
                updatedNotification.lida ? Math.max(0, prev - 1) : prev + 1
              );
            }
          } else if (payload.eventType === 'DELETE') {
            // Remove the notification from the list
            const deletedNotificationId = payload.old.id;
            
            // Add to locally deleted set
            deletedIdsRef.current.add(deletedNotificationId);
            
            setNotifications(prevNotifications => 
              prevNotifications.filter(n => n.id !== deletedNotificationId)
            );
            
            // Update unread count if the deleted notification was unread
            if (!payload.old.lida) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  // Sincronizar badges entre dispositivos
  useEffect(() => {
    if (user) {
      // Solicitar sincronização ao montar o componente
      syncNotifications();

      // Configurar listener para respostas do service worker
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'NOTIFICATIONS_SYNCED') {
          console.log('Notifications synced at:', event.data.timestamp);
          fetchNotifications();
        }
      };

      // Adicionar o event listener
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', messageHandler);
      }

      // Cleanup
      return () => {
        if (navigator.serviceWorker) {
          navigator.serviceWorker.removeEventListener('message', messageHandler);
        }
      };
    }
  }, [user, fetchNotifications, syncNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, lida: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));

      toast({
        description: "Notificação marcada como lida"
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ excluida: true })
        .eq('id', id);

      if (error) throw error;

      // Add the ID to the deleted IDs set to prevent it from reappearing
      deletedIdsRef.current.add(id);

      const notificationToRemove = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));
      
      if (notificationToRemove && !notificationToRemove.lida) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      toast({
        description: "Notificação excluída"
      });
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.lida).map(n => n.id);
      
      if (unreadIds.length === 0) return;
      
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, lida: true })));
      setUnreadCount(0);

      toast({
        description: "Todas as notificações foram marcadas como lidas"
      });
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead
  };
};
