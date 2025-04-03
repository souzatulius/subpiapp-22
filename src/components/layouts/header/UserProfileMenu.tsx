
import React, { useState, useEffect } from 'react';
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
import { LogOut, Settings, User } from 'lucide-react';
import AvatarDisplay from '@/components/profile/photo/AvatarDisplay';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { toast } from '@/components/ui/use-toast';
import { useSession } from '@supabase/auth-helpers-react';

const UserProfileMenu: React.FC = () => {
  const { signOut, user } = useAuth();
  const session = useSession();
  const { userProfile, isLoading, refreshUserProfile } = useUserProfile();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  
  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      refreshUserProfile();
    };
    
    window.addEventListener('profile:updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile:updated', handleProfileUpdate);
    };
  }, [refreshUserProfile]);
  
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
  
  const openEditProfileModal = () => {
    setIsEditProfileModalOpen(true);
  };

  // Show nothing while loading to avoid flash of content
  if (isLoading || !user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 mr-2 md:mr-0 md:h-auto md:w-auto md:px-4 md:py-2">
            <div className="flex items-center gap-2">
              <AvatarDisplay 
                nome={userProfile?.nome_completo || user.email || ''}
                imageSrc={userProfile?.foto_perfil_url}
                size="sm" 
              />
              <div className="hidden md:flex md:flex-col md:items-start">
                <span className="font-bold text-sm text-gray-900">
                  {userProfile?.nome_completo?.split(' ')[0] || 'Usuário'}
                </span>
                <span className="text-xs text-gray-500">
                  {userProfile?.email || user.email}
                </span>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={openEditProfileModal} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Editar perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/notificacoes">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurar notificações</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-700">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        userData={userProfile}
        refreshUserData={refreshUserProfile}
      />
    </>
  );
};

export default UserProfileMenu;
