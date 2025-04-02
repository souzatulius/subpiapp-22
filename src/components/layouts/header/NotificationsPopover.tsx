
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotifications } from './useNotifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationsPopover: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>("todas");
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead
  } = useNotifications();

  // Filter notifications based on the selected filter
  const filteredNotifications = React.useMemo(() => {
    if (filter === "todas") return notifications;
    return notifications.filter(notification => notification.tipo === filter || notification.referencia_tipo === filter);
  }, [notifications, filter]);

  const getNotificationIcon = (tipo: string, referencia_tipo?: string) => {
    const useTipo = referencia_tipo || tipo;
    
    switch (useTipo) {
      case 'demanda':
      case 'demanda_nova':
      case 'demanda_atualizada':
        return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'comunicado':
        return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
      case 'nota':
      case 'nota_nova':
      case 'nota_aprovacao':
        return <div className="w-2 h-2 rounded-full bg-orange-500"></div>;
      case 'prazo_proximo':
        return <div className="w-2 h-2 rounded-full bg-red-500"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
    }
  };
  
  // Retornar badge personalizado por tipo
  const getNotificationBadge = (tipo: string, referencia_tipo?: string) => {
    const useTipo = referencia_tipo || tipo;
    
    let label = "Geral";
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (useTipo) {
      case 'demanda':
      case 'demanda_nova':
        label = "Demanda";
        variant = "default";
        break;
      case 'demanda_atualizada':
        label = "Atualização";
        variant = "outline";
        break;
      case 'comunicado':
        label = "Comunicado";
        variant = "secondary";
        break;
      case 'nota':
      case 'nota_nova':
        label = "Nota";
        variant = "outline";
        break;
      case 'nota_aprovacao':
        label = "Aprovação";
        variant = "destructive";
        break;
      case 'prazo_proximo':
        label = "Prazo";
        variant = "destructive";
        break;
    }
    
    return <Badge variant={variant} className="text-[10px] h-5 px-1.5">{label}</Badge>;
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
  
  // Handle notification click to navigate to the relevant page
  const handleNotificationClick = (notification: typeof notifications[0]) => {
    const { referencia_id, referencia_tipo, metadados } = notification;
    
    if (!referencia_id) return;
    
    // Mark as read automatically when clicked
    markAsRead(notification.id);
    
    let url = '/';
    
    if (referencia_tipo === 'demanda' || referencia_tipo === 'demanda_nova' || referencia_tipo === 'demanda_atualizada') {
      url = `/demandas/${referencia_id}`;
    } else if (referencia_tipo === 'nota' || referencia_tipo === 'nota_nova' || referencia_tipo === 'nota_aprovacao') {
      url = `/notas/${referencia_id}`;
    } else if (referencia_tipo === 'comunicado') {
      url = `/comunicados/${referencia_id}`;
    } else if (metadados?.url) {
      url = metadados.url;
    }
    
    setIsOpen(false);
    navigate(url);
  };

  // Filtros disponíveis para notificações
  const availableFilters = [
    { value: "todas", label: "Todas" },
    { value: "demanda_nova", label: "Demandas Novas" },
    { value: "demanda_atualizada", label: "Atualizações" },
    { value: "nota_nova", label: "Notas Novas" },
    { value: "nota_aprovacao", label: "Aprovações" },
    { value: "comunicado", label: "Comunicados" },
    { value: "prazo_proximo", label: "Prazos" }
  ];

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
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                  {availableFilters.map(option => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                <Check className="h-3 w-3 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>
        <div className="overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <span className="inline-block border-t-2 border-blue-500 border-solid rounded-full w-5 h-5 animate-spin mr-2"></span>
              Carregando...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 bg-zinc-100">
              Nenhuma notificação {filter !== "todas" ? "deste tipo" : ""}
            </div>
          ) : (
            <div>
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b flex hover:bg-gray-50 transition-colors ${!notification.lida ? 'bg-blue-50' : ''}`}
                  role="button"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="mr-3 mt-1">{getNotificationIcon(notification.tipo || 'comunicado', notification.referencia_tipo)}</div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      {getNotificationBadge(notification.tipo || 'comunicado', notification.referencia_tipo)}
                      <span className="text-xs text-gray-500 ml-2">{formatDate(notification.data_envio)}</span>
                    </div>
                    <p className="text-sm">{notification.mensagem}</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {!notification.lida && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }} 
                        className="text-blue-500 hover:text-blue-700 p-1" 
                        title="Marcar como lida"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }} 
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
