import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import { ProfileData } from '@/components/profile/types';
const UserProfileMenu = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userProfile, setUserProfile] = useState<{
    nome_completo?: string;
    email?: string;
    foto_perfil_url?: string;
    coordenacao?: {
      descricao: string;
    };
    whatsapp?: string;
    aniversario?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const {
          data,
          error
        } = await supabase.from('usuarios').select(`
            nome_completo,
            email,
            foto_perfil_url,
            coordenacao:coordenacoes(descricao),
            whatsapp,
            aniversario
          `).eq('id', user.id).single();
        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [user]);
  const getInitials = () => {
    if (!userProfile?.nome_completo) return 'U';
    const nameParts = userProfile.nome_completo.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
  };
  const getFirstAndLastName = () => {
    if (!userProfile?.nome_completo) return 'Usuário';
    const nameParts = userProfile.nome_completo.split(' ');
    if (nameParts.length === 1) return nameParts[0];
    return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
  };
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Erro ao sair',
        description: 'Não foi possível encerrar sua sessão corretamente.',
        variant: 'destructive'
      });
    }
  };
  const handleEditProfile = () => {
    setIsProfileModalOpen(true);
  };
  const handleProfileUpdate = (updatedData: Partial<ProfileData>) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        nome_completo: updatedData.nome_completo || userProfile.nome_completo,
        whatsapp: updatedData.whatsapp || userProfile.whatsapp,
        aniversario: updatedData.aniversario ? typeof updatedData.aniversario === 'string' ? updatedData.aniversario : new Date(updatedData.aniversario).toISOString() : userProfile.aniversario
      });
    }
  };
  const profileData: ProfileData = {
    nome_completo: userProfile?.nome_completo || '',
    whatsapp: userProfile?.whatsapp || '',
    aniversario: userProfile?.aniversario || ''
  };
  return <div className="flex items-center">
      {/* Desktop view - Show name and department with reduced font size */}
      {!isMobile && <div className="mr-3 text-right hidden md:block">
          <h3 className="font-bold text-[#003570] text-sm">{getFirstAndLastName()}</h3>
          <p className="text-gray-500 text-xs">
            {userProfile?.coordenacao?.descricao || 'Sem coordenação'}
          </p>
        </div>}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              {userProfile?.foto_perfil_url ? <AvatarImage src={userProfile.foto_perfil_url} alt={userProfile.nome_completo || 'User avatar'} /> : <AvatarFallback className="bg-orange-500 text-white">{getInitials()}</AvatarFallback>}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isMobile && <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-bold text-sm">{getFirstAndLastName()}</p>
                  <p className="text-xs text-muted-foreground truncate">{userProfile?.email}</p>
                  {userProfile?.coordenacao && <p className="text-xs text-muted-foreground">
                      {userProfile.coordenacao.descricao}
                    </p>}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>}
          <DropdownMenuItem onClick={handleEditProfile}>
            <User className="mr-2 h-4 w-4" />
            <span>Editar Perfil</span>
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

      {/* Edit Profile Modal */}
      {user && userProfile && <ProfileEditModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} profileData={profileData} userId={user.id} onProfileUpdate={handleProfileUpdate} />}
    </div>;
};
export default UserProfileMenu;