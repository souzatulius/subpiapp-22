import React, { useState, useEffect } from 'react';
import { Bell, Settings, Menu, User, Check, Trash, X, UserCog, Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}
interface Notification {
  id: string;
  tipo?: string; // Make tipo optional
  mensagem: string;
  data_envio: string;
  lida: boolean;
  usuario_id?: string; // Add usuario_id as optional
}
const Header: React.FC<HeaderProps> = ({
  showControls = false,
  toggleSidebar
}) => {
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          nome_completo,
          cargo_id,
          area_coordenacao_id,
          foto_perfil_url,
          cargos:cargo_id(descricao),
          areas_coordenacao:area_coordenacao_id(descricao)
        `)
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('notificacoes').select('*').eq('usuario_id', user?.id).order('data_envio', {
        ascending: false
      }).limit(10);
      if (error) throw error;

      const processedNotifications = (data || []).map(notification => ({
        ...notification,
        tipo: 'comunicado'
      }));
      setNotifications(processedNotifications);
      setUnreadCount(processedNotifications.filter(n => !n.lida).length || 0);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from('notificacoes').update({
        lida: true
      }).eq('id', id);
      if (error) throw error;
      setNotifications(notifications.map(n => n.id === id ? {
        ...n,
        lida: true
      } : n));
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
      const {
        error
      } = await supabase.from('notificacoes').delete().eq('id', id);
      if (error) throw error;
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
      const {
        error
      } = await supabase.from('notificacoes').update({
        lida: true
      }).in('id', unreadIds);
      if (error) throw error;
      setNotifications(notifications.map(n => ({
        ...n,
        lida: true
      })));
      setUnreadCount(0);
      toast({
        description: "Todas as notificações foram marcadas como lidas"
      });
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  };

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

  const handleLogout = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
      toast({
        description: "Você foi desconectado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return <header className="w-full px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
      <div className="flex-1 flex justify-start">
        {showControls && <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4 px-0">
            <Menu className="h-5 w-5 text-[#003570]" />
          </Button>}
      </div>
      
      <div className="flex-1 flex justify-center">
        <img src="/lovable-uploads/a1cc6031-8d9a-4b53-b579-c990a3156837.png" alt="Logo Prefeitura de São Paulo" className="h-10" />
      </div>
      
      <div className="flex-1 flex justify-end">
        {showControls && <div className="flex items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-[#003570]" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 bg-[#f57c35] rounded-full flex items-center justify-center text-white text-[10px]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 max-h-[60vh] overflow-hidden flex flex-col">
                <div className="p-3 border-b flex justify-between items-center bg-zinc-200">
                  <h3 className="font-medium">Notificações</h3>
                  {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                      <Check className="h-3 w-3 mr-1" />
                      Marcar todas como lidas
                    </Button>}
                </div>
                <div className="overflow-y-auto flex-grow">
                  {notifications.length === 0 ? <div className="p-4 text-center text-gray-500 bg-zinc-100">
                      Nenhuma notificação
                    </div> : <div>
                      {notifications.map(notification => <div key={notification.id} className={`p-3 border-b flex hover:bg-gray-50 transition-colors ${!notification.lida ? 'bg-blue-50' : ''}`}>
                          <div className="mr-3 mt-1">{getNotificationIcon(notification.tipo || 'comunicado')}</div>
                          <div className="flex-grow">
                            <p className="text-sm">{notification.mensagem}</p>
                            <p className="text-xs text-gray-500">{formatDate(notification.data_envio)}</p>
                          </div>
                          <div className="flex flex-col space-y-1">
                            {!notification.lida && <button onClick={() => markAsRead(notification.id)} className="text-blue-500 hover:text-blue-700 p-1" title="Marcar como lida">
                                <Check className="h-4 w-4" />
                              </button>}
                            <button onClick={() => deleteNotification(notification.id)} className="text-red-500 hover:text-red-700 p-1" title="Excluir notificação">
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>)}
                    </div>}
                </div>
                <div className="p-3 border-t text-center bg-gray-100">
                  <Button variant="link" className="text-sm h-auto p-0" onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}>
                    Ver todas as notificações
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5 text-[#003570]" />
            </Button>
            <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-gray-100 hover:bg-gray-200 rounded-full">
                  {userProfile?.foto_perfil_url ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile.foto_perfil_url} alt={userProfile.nome_completo} />
                      <AvatarFallback>{getUserInitials(userProfile.nome_completo)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5 text-[#003570]" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 overflow-hidden">
                <div className="bg-gray-100 p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      {userProfile?.foto_perfil_url ? (
                        <AvatarImage src={userProfile.foto_perfil_url} alt={userProfile.nome_completo} />
                      ) : (
                        <AvatarFallback>{userProfile?.nome_completo ? getUserInitials(userProfile.nome_completo) : 'U'}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{userProfile?.nome_completo || 'Usuário'}</h3>
                      <p className="text-xs text-gray-500">
                        {userProfile?.areas_coordenacao?.descricao || 'Área não definida'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userProfile?.cargos?.descricao || 'Cargo não definido'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left py-2 hover:bg-[#f57c35] hover:text-white transition-colors"
                    onClick={() => { 
                      setIsProfileOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left py-2 hover:bg-[#f57c35] hover:text-white transition-colors"
                    onClick={() => { 
                      setIsProfileOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Ajustes da Conta
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left py-2 hover:bg-[#f57c35] hover:text-white transition-colors"
                    onClick={() => { 
                      setIsProfileOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Trocar Foto
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left py-2 hover:bg-[#f57c35] hover:text-white transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>}
      </div>
    </header>;
};
export default Header;
