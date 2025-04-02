
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotifications } from './useNotifications';

export const NotificationsPopover: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead
  } = useNotifications();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    // Subscribe to changes in the notifications table for this user
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Only listen for new notifications
          schema: 'public',
          table: 'notificacoes',
          filter: `usuario_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          // Only refresh notifications when new ones are inserted
          fetchNotifications();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'demanda':
        return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'comunicado':
        return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
      case 'nota':
        return <div className="w-2 h-2 rounded-full bg-orange-500"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-[#003570]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-[#f57c35] rounded-full flex items-center justify-center text-white text-[10px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-[60vh] overflow-hidden flex flex-col">
        <div className="p-3 border-b flex justify-between items-center bg-zinc-200">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
              <Check className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="overflow-y-auto flex-grow">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 bg-zinc-100">
              Nenhuma notificação
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b flex hover:bg-gray-50 transition-colors ${!notification.lida ? 'bg-blue-50' : ''}`}
                >
                  <div className="mr-3 mt-1">{getNotificationIcon(notification.tipo || 'comunicado')}</div>
                  <div className="flex-grow">
                    <p className="text-sm">{notification.mensagem}</p>
                    <p className="text-xs text-gray-500">{formatDate(notification.data_envio)}</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {!notification.lida && (
                      <button 
                        onClick={() => markAsRead(notification.id)} 
                        className="text-blue-500 hover:text-blue-700 p-1" 
                        title="Marcar como lida"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)} 
                      className="text-red-500 hover:text-red-700 p-1" 
                      title="Excluir notificação"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t text-center bg-gray-100">
          <Button 
            variant="link" 
            className="text-sm h-auto p-0" 
            onClick={() => {
              setIsOpen(false);
              navigate('/settings?tab=notificacoes');
            }}
          >
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
