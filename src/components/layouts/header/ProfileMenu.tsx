
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
import { ProfileData } from '@/components/profile/types';
import ChangePhotoModal from '@/components/profile/photo/ChangePhotoModal';

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, isLoading, refreshUserProfile } = useUserProfile();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false);
  const [isChangePhotoModalOpen, setIsChangePhotoModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      // Garantir redirecionamento para login após logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      // Mesmo em caso de erro, redirecionar para login
      navigate('/login', { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/settings');
  };

  // Convert userProfile to ProfileData format
  const profileData: ProfileData | null = userProfile ? {
    nome_completo: userProfile.nome_completo || '',
    whatsapp: userProfile.whatsapp || '',
    aniversario: userProfile.aniversario
  } : null;

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  const displayName = userProfile?.nome_completo || 'Usuário';
  const photoUrl = userProfile?.foto_perfil_url || '';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="focus:outline-none flex items-center gap-2"
            onClick={(e) => e.preventDefault()}
          >
            <AvatarDisplay 
              nome={displayName}
              imageSrc={photoUrl}
              size="md"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              setIsChangePhotoModalOpen(true);
            }} 
            className="cursor-pointer py-2"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Alterar foto</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              setIsEditProfileModalOpen(true);
            }} 
            className="cursor-pointer py-2"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Editar Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              setIsAccountSettingsModalOpen(true);
            }} 
            className="cursor-pointer py-2"
          >
            <Bell className="mr-2 h-4 w-4" />
            <span>Ajustes de Notificações</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={goToProfile} 
            className="cursor-pointer py-2"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              handleSignOut();
            }} 
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
        userData={profileData}
        refreshUserData={refreshUserProfile}
      />
      
      <AccountSettingsModal
        isOpen={isAccountSettingsModalOpen}
        onClose={() => setIsAccountSettingsModalOpen(false)}
      />

      <ChangePhotoModal
        isOpen={isChangePhotoModalOpen}
        onClose={() => setIsChangePhotoModalOpen(false)}
      />
    </>
  );
};

export default ProfileMenu;
