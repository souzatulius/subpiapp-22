
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Shield, User, Mail, Calendar, Phone, Edit, Building, Users } from 'lucide-react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import EditProfileModal from './EditProfileModal';
import { ProfileData, UserProfile } from './types';
import AvatarDisplay from './photo/AvatarDisplay';

const UserProfileView: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch user data
  const fetchUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data: supabaseData, error } = await fetch(`/api/users/${user.id}`).then(res => res.json());
      
      if (error) throw error;
      
      if (supabaseData) {
        setUserData(supabaseData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus dados. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    await fetchUserProfile();
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum dado de usuário encontrado.</p>
        <Button 
          onClick={fetchUserProfile} 
          variant="outline" 
          className="mt-4"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  const formattedAniversario = userData.aniversario
    ? format(new Date(userData.aniversario), 'dd/MM', { locale: ptBR })
    : 'Não informado';

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Perfil do Usuário</CardTitle>
          <CardDescription>Visualize e edite suas informações de perfil</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile header with photo and edit button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AvatarDisplay 
                nome={userData.nome_completo || ''}
                imageSrc={userData.foto_perfil_url}
                size="xl"
              />
              <div>
                <h2 className="text-xl font-semibold">{userData.nome_completo}</h2>
                <p className="text-gray-500">{userData.cargo}</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center space-x-1"
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-1" />
              <span>Editar Perfil</span>
            </Button>
          </div>

          {/* User information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 border-b pb-1">Informações Pessoais</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Nome completo:</span>
                  <span className="font-medium">{userData.nome_completo || '-'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Email:</span>
                  <span className="font-medium">{userData.email || '-'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Aniversário:</span>
                  <span className="font-medium">{formattedAniversario}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">WhatsApp:</span>
                  <span className="font-medium">{userData.whatsapp || '-'}</span>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 border-b pb-1">Informações Profissionais</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Cargo:</span>
                  <span className="font-medium">{userData.cargo || '-'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Coordenação:</span>
                  <span className="font-medium">{userData.coordenacao || '-'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Supervisão Técnica:</span>
                  <span className="font-medium">{userData.supervisao_tecnica || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-xs text-gray-500 border-t pt-4">
          <p>ID de usuário: {userData.id}</p>
        </CardFooter>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={{
          nome_completo: userData.nome_completo,
          whatsapp: userData.whatsapp,
          aniversario: userData.aniversario,
          foto_perfil_url: userData.foto_perfil_url
        }}
        refreshUserData={refreshUserData}
      />
    </div>
  );
};

export default UserProfileView;
