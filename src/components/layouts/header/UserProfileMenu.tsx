
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogOut, User, Settings, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const UserProfileMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userProfile, setUserProfile] = useState<{
    nome_completo?: string;
    email?: string;
    foto_perfil_url?: string;
    coordenacao?: { descricao: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            nome_completo,
            email,
            foto_perfil_url,
            coordenacao:coordenacoes(descricao)
          `)
          .eq('id', user.id)
          .single();

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
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-8 w-8">
            {userProfile?.foto_perfil_url ? (
              <AvatarImage 
                src={userProfile.foto_perfil_url} 
                alt={userProfile.nome_completo || 'User avatar'} 
              />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white">{getInitials()}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isMobile && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="font-bold text-sm">{getFirstAndLastName()}</p>
                <p className="text-xs text-muted-foreground truncate">{userProfile?.email}</p>
                {userProfile?.coordenacao && (
                  <p className="text-xs text-muted-foreground">
                    {userProfile.coordenacao.descricao}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
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
  );
};

export default UserProfileMenu;
