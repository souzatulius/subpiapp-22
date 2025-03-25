
import React from 'react';
import { Bell, Check, RefreshCw, X } from 'lucide-react';
import { Notification } from '@/components/settings/announcements/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsPopoverProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onDeleteNotification,
  onMarkAllAsRead,
  onRefresh
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-medium">Notificações</h3>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRefresh}
              title="Atualizar"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMarkAllAsRead}
                title="Marcar todas como lidas"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="py-8 px-4 text-center text-sm text-gray-500">
              Nenhuma notificação no momento
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 transition-colors ${!notification.lida ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex justify-between">
                    <div className="flex-1 mr-4">
                      <p className={`text-sm ${!notification.lida ? 'font-medium' : ''}`}>
                        {notification.mensagem}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(notification.data_envio), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {!notification.lida && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => onMarkAsRead(notification.id)}
                          title="Marcar como lida"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => onDeleteNotification(notification.id)}
                        title="Excluir"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
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
