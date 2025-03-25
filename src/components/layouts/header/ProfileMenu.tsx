
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AvatarDisplay from '@/components/profile/photo/AvatarDisplay';
import { useUserProfile } from './useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import EditProfileModal from '@/components/profile/EditProfileModal';
import AccountSettingsModal from '@/components/profile/AccountSettingsModal';

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, isLoading } = useUserProfile();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const goToProfile = () => {
    navigate('/settings');
  };

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  const displayName = userProfile?.nome_completo || 'Usuário';
  const photoUrl = userProfile?.foto_perfil_url || '';
  const coordenacao = userProfile?.coordenacao || '-';
  const supervisao = userProfile?.supervisao_tecnica || '-';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none flex items-center gap-2">
            <div className="hidden md:block text-right mr-2">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-gray-500">{coordenacao} {supervisao !== '-' ? `/ ${supervisao}` : ''}</p>
            </div>
            <AvatarDisplay 
              nome={displayName}
              imageSrc={photoUrl}
              size="md"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <div className="p-3">
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-gray-500 mt-1">{userProfile?.email}</p>
            <div className="flex flex-col mt-1">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Coordenação:</span> {coordenacao}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Supervisão:</span> {supervisao}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditProfileModalOpen(true)} className="cursor-pointer py-2">
            <User className="mr-2 h-4 w-4" />
            <span>Editar Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAccountSettingsModalOpen(true)} className="cursor-pointer py-2">
            <Bell className="mr-2 h-4 w-4" />
            <span>Ajustes de Notificações</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={goToProfile} className="cursor-pointer py-2">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut} 
            disabled={isSigningOut}
            className="cursor-pointer text-destructive focus:text-destructive py-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isSigningOut ? 'Saindo...' : 'Sair'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <EditProfileModal 
        isOpen={isEditProfileModalOpen} 
        onClose={() => setIsEditProfileModalOpen(false)} 
      />
      
      <AccountSettingsModal
        isOpen={isAccountSettingsModalOpen}
        onClose={() => setIsAccountSettingsModalOpen(false)}
      />
    </>
  );
};

export default ProfileMenu;
