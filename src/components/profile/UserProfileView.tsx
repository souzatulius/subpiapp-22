
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Loader2, Mail, Briefcase, Building2, CalendarDays, Building } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/types/common';

interface ExtendedUserProfile extends UserProfile {
  cargo_descricao?: string;
  coordenacao_descricao?: string;
  supervisao_tecnica_descricao?: string;
}

const UserProfileView: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            id,
            nome_completo,
            email,
            whatsapp,
            aniversario,
            foto_perfil_url,
            cargo:cargos(id, descricao),
            coordenacao:coordenacoes(id, descricao),
            supervisao_tecnica:supervisoes_tecnicas(id, descricao)
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setProfile({
          ...data,
          cargo_descricao: data.cargo?.descricao,
          coordenacao_descricao: data.coordenacao?.descricao,
          supervisao_tecnica_descricao: data.supervisao_tecnica?.descricao
        });
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Perfil não encontrado</h3>
        <p className="text-muted-foreground">Não foi possível carregar suas informações de perfil.</p>
      </div>
    );
  }

  const getInitials = () => {
    if (!profile.nome_completo) return 'U';
    
    const nameParts = profile.nome_completo.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center pb-2 gap-4">
          <Avatar className="h-20 w-20">
            {profile.foto_perfil_url ? (
              <AvatarImage src={profile.foto_perfil_url} alt={profile.nome_completo} />
            ) : (
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{profile.nome_completo}</CardTitle>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              <span>{profile.email}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.cargo_descricao && (
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cargo</h3>
                  <p className="mt-1">{profile.cargo_descricao}</p>
                </div>
              </div>
            )}
            
            {profile.coordenacao_descricao && (
              <div className="flex items-start">
                <Building2 className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Coordenação</h3>
                  <p className="mt-1">{profile.coordenacao_descricao}</p>
                </div>
              </div>
            )}
            
            {profile.supervisao_tecnica_descricao && (
              <div className="flex items-start">
                <Building className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Supervisão Técnica</h3>
                  <p className="mt-1">{profile.supervisao_tecnica_descricao}</p>
                </div>
              </div>
            )}
            
            {profile.aniversario && (
              <div className="flex items-start">
                <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Nascimento</h3>
                  <p className="mt-1">{format(new Date(profile.aniversario), 'dd/MM/yyyy')}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileView;
