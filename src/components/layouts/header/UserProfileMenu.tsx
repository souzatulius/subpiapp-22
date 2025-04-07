
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import { useUserProfile } from './useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotifications } from './useNotifications';
import { useIsMobile } from '@/hooks/use-mobile';

const UserProfileMenu: React.FC = () => {
  const { userProfile, isLoading } = useUserProfile();
  const { unreadCount, fetchNotifications } = useNotifications();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Fetch notifications when component mounts
  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema."
      });
      
      // Garantir que o usuário sempre seja redirecionado para a página de login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo em caso de erro, tentar redirecionar para a página de login
      navigate('/login', { replace: true });
    }
  };

  const getInitials = () => {
    if (!userProfile?.nome_completo) return 'U';
    
    const nameParts = userProfile.nome_completo.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
  };

  // Extract first two names from user's full name
  const getFirstTwoNames = () => {
    if (!userProfile?.nome_completo) return 'Usuário';
    
    const nameParts = userProfile.nome_completo.split(' ');
    if (nameParts.length === 1) return nameParts[0];
    
    return `${nameParts[0]} ${nameParts[1]}`;
  };

  return (
    <div className="flex items-center">
      {/* User info - visible only on desktop */}
      {!isMobile && userProfile && (
        <div className="mr-3 text-right hidden md:block">
          <p className="text-blue-900 font-semibold">{getFirstTwoNames()}</p>
          <p className="text-gray-500 text-sm">{userProfile.email}</p>
        </div>
      )}
      
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
    </div>
  );
};

export default UserProfileMenu;
