
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useSupabaseAuth';

export const useNotifications = () => {
  const { user } = useAuth();
  const [isNotificationsSupported, setIsNotificationsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check if browser supports notifications
    setIsNotificationsSupported('Notification' in window);
    
    // Check if permission is already granted
    if ('Notification' in window) {
      setIsPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from('notificacoes')
          .select('*', { count: 'exact' })
          .eq('usuario_id', user.id)
          .eq('lida', false);

        if (error) {
          console.error('Error fetching notifications count:', error);
          return;
        }

        setUnreadCount(count || 0);
      } catch (error) {
        console.error('Error in fetchUnreadCount:', error);
      }
    };

    fetchUnreadCount();

    // Subscribe to notifications changes
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notificacoes',
        filter: `usuario_id=eq.${user.id}`
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const requestPermissionAndRegisterToken = async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setIsPermissionGranted(permission === 'granted');
      
      if (permission === 'granted') {
        // Here you would register the device token with your backend
        console.log('Notification permission granted');
        
        // Update user preferences in Supabase
        if (user) {
          await supabase
            .from('usuarios')
            .update({
              configuracoes_notificacao: {
                navegador_ativo: true,
                email_ativo: false,
                whatsapp_ativo: false,
                frequencia: 'imediato'
              }
            })
            .eq('id', user.id);
        }
        
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const fetchNotifications = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      return [];
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', notificationId)
        .eq('usuario_id', user.id);
      
      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('usuario_id', user.id)
        .eq('lida', false);
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }
      
      setUnreadCount(0);
      return true;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return false;
    }
  };

  return {
    isNotificationsSupported,
    isPermissionGranted,
    unreadCount,
    requestPermissionAndRegisterToken,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
