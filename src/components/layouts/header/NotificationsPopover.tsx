
import React, { useEffect } from 'react';
import { Bell, Check, Trash2, ArrowRight, AlertTriangle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from './useNotifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const NotificationsPopover: React.FC = () => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    loading
  } = useNotifications();

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications every 30 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read first
    if (!notification.lida) {
      await markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    switch(notification.tipo) {
      case 'nova_demanda':
        navigate(`/dashboard/comunicacao/responder-demandas?id=${notification.referencia_id}`);
        break;
      case 'resposta_demanda':
        navigate(`/dashboard/comunicacao/criar-nota?demanda_id=${notification.referencia_id}`);
        break;
      case 'nota_produzida':
        navigate(`/dashboard/comunicacao/aprovar-notas?nota_id=${notification.referencia_id}`);
        break;
      case 'nota_aprovada':
      case 'nota_rejeitada':
        navigate(`/dashboard/comunicacao/notas-oficiais?nota_id=${notification.referencia_id}`);
        break;
      default:
        // For notifications without a specific route, just show the message
        toast({
          title: 'Notificação',
          description: notification.mensagem,
          duration: 5000,
        });
    }
  };

  // Helper function to get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'nova_demanda':
        return <Bell className="h-3.5 w-3.5" />;
      case 'resposta_demanda':
        return <Check className="h-3.5 w-3.5" />;
      case 'nota_produzida':
        return <ArrowRight className="h-3.5 w-3.5" />;
      case 'nota_aprovada':
        return <Check className="h-3.5 w-3.5" />;
      case 'nota_rejeitada':
        return <AlertTriangle className="h-3.5 w-3.5" />;
      default:
        return <Bell className="h-3.5 w-3.5" />;
    }
  };

  // Get badge color based on notification type
  const getNotificationBadgeColor = (type: string) => {
    switch(type) {
      case 'nova_demanda':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resposta_demanda':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'nota_produzida':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'nota_aprovada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'nota_rejeitada':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-[80vh] p-0 bg-gray-100" align="end">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-200">
          <h4 className="text-sm font-medium">Notificações</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
              <p className="text-sm text-gray-500">Carregando notificações...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Bell className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y bg-white">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 hover:bg-gray-50 ${!notification.lida ? 'bg-blue-50' : ''} cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium mb-1 flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`mr-1 text-xs py-0 flex items-center gap-1 ${getNotificationBadgeColor(notification.tipo)}`}
                      >
                        {getNotificationIcon(notification.tipo)}
                        {notification.tipo ? notification.tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Notificação'}
                      </Badge>
                    </p>
                    <div className="flex items-center gap-1">
                      {!notification.lida && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-5 w-5 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-3">{notification.mensagem}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.data_envio || notification.created_at || '')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
