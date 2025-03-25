
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';

export interface Notification {
  id: string;
  tipo?: string;
  mensagem: string;
  data_envio: string;
  lida: boolean;
  usuario_id?: string;
  referencia_id?: string;
  excluida?: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const deletedIdsRef = useRef<Set<string>>(new Set());

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('excluida', false) // Fetch only non-deleted notifications
        .order('data_envio', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Ensure each notification has a tipo property with a default value
      const processedNotifications = (data || []).map(notification => ({
        ...notification,
        tipo: notification.tipo || 'comunicado' // Default to 'comunicado' if tipo is missing
      })) as Notification[];

      setNotifications(processedNotifications);
      setUnreadCount(processedNotifications.filter(n => !n.lida).length || 0);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }, [user]);

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
      // Update the notification to mark it as deleted instead of removing it
      const { error } = await supabase
        .from('notificacoes')
        .update({ excluida: true })
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
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
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead
  };
};
