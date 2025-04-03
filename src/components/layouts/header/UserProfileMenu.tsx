
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import { useUserProfile } from './useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotifications } from './useNotifications';

const UserProfileMenu: React.FC = () => {
  const { userProfile, isLoading } = useUserProfile();
  const { unreadCount, fetchNotifications } = useNotifications();
  const navigate = useNavigate();

  // Fetch notifications when component mounts
  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema."
      });
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getInitials = () => {
    if (!userProfile?.nome_completo) return 'U';
    
    const nameParts = userProfile.nome_completo.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-9 w-9 cursor-pointer border border-white/20 bg-blue-900 hover:bg-orange-500 transition-colors">
            {userProfile?.foto_perfil_url ? (
              <img src={userProfile.foto_perfil_url} alt="Foto de perfil" className="object-cover" />
            ) : (
              <AvatarFallback className="bg-blue-900 hover:bg-orange-500 transition-colors text-white text-base font-semibold">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userProfile?.nome_completo || 'Usuário'}</p>
              <p className="text-xs leading-none text-gray-500">{userProfile?.email || ''}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings/notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Gerenciar Notificações</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
};

export default UserProfileMenu;
