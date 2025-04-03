
import React from 'react';
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

const UserProfileMenu: React.FC = () => {
  const { signOut, user } = useAuth();
  const { userProfile, isLoading } = useUserProfile();
  
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
              className="bg-orange-500"
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
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
        
        <DropdownMenuItem asChild>
          <Link to="/notificacoes">
            <Bell className="mr-2 h-4 w-4" />
            <span>Gerenciar Notificações</span>
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
