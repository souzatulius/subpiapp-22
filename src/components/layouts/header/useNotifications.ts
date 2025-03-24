
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export type Notification = {
  id: string;
  mensagem: string;
  data_envio: string;
  lida: boolean;
  tipo?: string;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.lida).length;

  // Function to fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('excluida', false)
        .order('data_envio', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notificações:', error);
        toast.error("Erro", {
          description: "Erro ao buscar notificações. Por favor, tente novamente."
        });
        return;
      }

      setNotifications(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error);
      toast.error("Erro", {
        description: error.message || "Ocorreu um erro ao buscar as notificações."
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    // Set up a real-time subscription to the 'notificacoes' table
    if (user) {
      const channel = supabase
        .channel('public:notificacoes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notificacoes', filter: `usuario_id=eq.${user?.id}` },
          (payload) => {
            // When a new notification arrives, update the state
            if (payload.new) {
              setNotifications((prevNotifications) => [
                payload.new as Notification,
                ...prevNotifications,
              ]);
            }
          }
        )
        .subscribe();

      // Unsubscribe from the channel when the component unmounts
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', id);

      if (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        toast.error("Erro", {
          description: "Erro ao marcar notificação como lida. Por favor, tente novamente."
        });
        return;
      }

      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, lida: true } : notification
        )
      );
    } catch (error: any) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error("Erro", {
        description: "Erro ao marcar notificação como lida. Por favor, tente novamente."
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ excluida: true })
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir notificação:', error);
        toast.error("Erro", {
          description: "Erro ao excluir notificação. Por favor, tente novamente."
        });
        return;
      }

      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== id)
      );
    } catch (error: any) {
      console.error('Erro ao excluir notificação:', error);
      toast.error("Erro", {
        description: "Erro ao excluir notificação. Por favor, tente novamente."
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('usuario_id', user?.id)
        .eq('excluida', false);

      if (error) {
        console.error('Erro ao marcar todas as notificações como lidas:', error);
        toast.error("Erro", {
          description: "Erro ao marcar todas as notificações como lidas. Por favor, tente novamente."
        });
        return;
      }

      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, lida: true }))
      );
    } catch (error: any) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      toast.error("Erro", {
        description: "Erro ao marcar todas as notificações como lidas. Por favor, tente novamente."
      });
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    fetchNotifications, // Added this function
    unreadCount        // Added the unread count
  };
};
