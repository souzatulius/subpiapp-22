import React, { useState } from 'react';
import { User, UserCog, Settings, Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { useUserProfile } from './useUserProfile';
import EditProfileModal from '@/components/profile/EditProfileModal';
import AccountSettingsModal from '@/components/profile/AccountSettingsModal';
import ChangePhotoModal from '@/components/profile/photo/ChangePhotoModal';
import AvatarDisplay from '@/components/profile/photo/AvatarDisplay';

export const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { userProfile } = useUserProfile();
  
  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showChangePhoto, setShowChangePhoto] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error("Erro", { 
        description: "Erro ao fazer logout. Por favor, tente novamente." 
      });
    }
  };

  const handleOpenEditProfile = () => {
    setIsProfileOpen(false);
    setShowEditProfile(true);
  };

  const handleOpenAccountSettings = () => {
    setIsProfileOpen(false);
    setShowAccountSettings(true);
  };

  const handleOpenChangePhoto = () => {
    setIsProfileOpen(false);
    setShowChangePhoto(true);
  };

  return (
    <>
      <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-gray-100 hover:bg-gray-200 rounded-full">
            {userProfile ? (
              <AvatarDisplay userProfile={userProfile} previewUrl={null} size="sm" />
            ) : (
              <User className="h-5 w-5 text-[#003570]" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0 overflow-hidden">
          <div className="bg-gray-100 p-4 px-0 rounded-none">
            <div className="flex items-center space-x-3 bg-transparent my-0">
              <AvatarDisplay userProfile={userProfile} previewUrl={null} size="md" />
              <div>
                <h3 className="text-gray-900 text-base font-bold">{userProfile?.nome_completo || 'Usuário'}</h3>
                <p className="text-gray-500 text-sm font-medium">
                  {userProfile?.areas_coordenacao?.descricao || 'Área não definida'}
                </p>
                <p className="text-xs text-slate-900">
                  {userProfile?.cargos?.descricao || 'Cargo não definido'}
                </p>
              </div>
            </div>
          </div>
          <div className="p-1 bg-zinc-50">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left py-2 hover:bg-[#f57c35] hover:text-white transition-colors"
              onClick={handleOpenEditProfile}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left py-2 hover:bg-[#f57c35] hover:text-white transition-colors"
              onClick={handleOpenAccountSettings}
            >
              <Settings className="mr-2 h-4 w-4" />
              Ajustes da Conta
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left py-2 hover:bg-[#f57c35] hover:text-white transition-colors"
              onClick={handleOpenChangePhoto}
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

      {/* Modals */}
      <EditProfileModal 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />
      
      <AccountSettingsModal 
        isOpen={showAccountSettings} 
        onClose={() => setShowAccountSettings(false)} 
      />
      
      <ChangePhotoModal 
        isOpen={showChangePhoto} 
        onClose={() => setShowChangePhoto(false)} 
      />
    </>
  );
};

// Add default export that points to the same component
export default ProfileMenu;
