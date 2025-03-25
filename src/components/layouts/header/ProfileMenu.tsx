
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import AvatarDisplay from '@/components/profile/photo/AvatarDisplay';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUserProfile } from './useUserProfile';
import EditProfileModal from '@/components/profile/EditProfileModal';
import AccountSettingsModal from '@/components/profile/AccountSettingsModal';
import { UserRound, Settings, LogOut, CalendarDays, Mail, Phone, Briefcase, Building } from 'lucide-react';

export default function ProfileMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { userProfile, isLoading } = useUserProfile();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const openAccountModal = () => {
    setIsAccountModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <AvatarDisplay
              userName={userProfile.nome_completo}
              photoUrl={userProfile.foto_perfil_url}
              size={40}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" sideOffset={5}>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-base font-medium leading-none">{userProfile.nome_completo}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <div className="px-2 py-1.5 text-sm">
              {userProfile.cargo && (
                <div className="flex items-center mb-2">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.cargo}</span>
                </div>
              )}
              {userProfile.supervisao_tecnica && (
                <div className="flex items-center mb-2">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.supervisao_tecnica}</span>
                </div>
              )}
              {userProfile.coordenacao && (
                <div className="flex items-center mb-2">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.coordenacao}</span>
                </div>
              )}
              {userProfile.whatsapp && (
                <div className="flex items-center mb-2">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.whatsapp}</span>
                </div>
              )}
              {userProfile.aniversario && (
                <div className="flex items-center mb-2">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(userProfile.aniversario), "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={openProfileModal}>
              <UserRound className="mr-2 h-4 w-4" />
              <span>Editar Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openAccountModal}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações da Conta</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <AccountSettingsModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}
