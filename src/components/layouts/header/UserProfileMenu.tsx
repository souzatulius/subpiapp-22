
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUserProfile } from './useUserProfile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Bell } from 'lucide-react';
import AvatarDisplay from '@/components/profile/photo/AvatarDisplay';
import { toast } from '@/components/ui/use-toast';
import { useNotifications } from './useNotifications';

const UserProfileMenu: React.FC = () => {
  const { signOut, user } = useAuth();
  const { userProfile, isLoading } = useUserProfile();
  const { notifications, unreadCount, fetchNotifications } = useNotifications();
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Não foi possível encerrar a sessão.",
        variant: "destructive"
      });
    }
  };

  // Função para obter apenas os dois primeiros nomes
  const getShortName = (fullName: string) => {
    if (!fullName) return '';
    const names = fullName.split(' ');
    return names.length > 1 
      ? `${names[0]} ${names[1]}` 
      : fullName;
  };
  
  // Formata data da notificação
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get only the latest 3 notifications
  const recentNotifications = notifications.slice(0, 3);

  // Show nothing while loading to avoid flash of content
  if (isLoading || !user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 mr-2 md:mr-0 md:h-auto md:w-auto md:px-4 md:py-2">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex md:flex-col md:items-end">
              <span className="font-bold text-sm text-subpi-blue-dark">
                {getShortName(userProfile?.nome_completo || 'Usuário')}
              </span>
              <span className="text-xs text-gray-400">
                {userProfile?.email || user.email}
              </span>
            </div>
            <AvatarDisplay 
              nome={userProfile?.nome_completo || user.email || ''}
              imageSrc={userProfile?.foto_perfil_url}
              size="sm"
              className={unreadCount > 0 ? "bg-orange-500" : "bg-[#003570]"}
              showNotificationCount={unreadCount > 0}
              notificationCount={unreadCount}
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-72">
        <div className="p-3">
          <p className="font-medium">{userProfile?.nome_completo || 'Usuário'}</p>
          <p className="text-xs text-gray-500 mt-1">{userProfile?.email || user.email}</p>
          {userProfile?.whatsapp && (
            <p className="text-xs text-gray-500 mt-1">WhatsApp: {userProfile.whatsapp}</p>
          )}
          {userProfile?.coordenacao && (
            <p className="text-xs text-gray-500 mt-1">Coordenação: {userProfile.coordenacao}</p>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Notificações recentes */}
        {recentNotifications.length > 0 ? (
          <div className="max-h-60 overflow-y-auto">
            <p className="px-3 py-1 text-xs font-semibold text-gray-500">Notificações recentes</p>
            {recentNotifications.map(notification => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-default">
                <p className="text-sm">{notification.mensagem}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(notification.data_envio)}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ) : (
          <DropdownMenuItem disabled className="text-center text-sm text-gray-500">
            Nenhuma notificação recente
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/notificacoes" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            <span>Ver todas notificações</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-700">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
