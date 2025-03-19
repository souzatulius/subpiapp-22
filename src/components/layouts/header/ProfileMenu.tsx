
import React, { useState, useEffect } from 'react';
import { User, UserCog, Settings, Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUserProfile } from './useUserProfile';

export const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { userProfile, fetchUserProfile } = useUserProfile();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

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

  return (
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
  );
};
