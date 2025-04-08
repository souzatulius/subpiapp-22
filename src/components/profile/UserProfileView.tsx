
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Phone, Calendar, Mail, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AvatarDisplay from './photo/AvatarDisplay';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileData } from './types';

interface UserProfileViewProps {
  userProfile: ProfileData | null;
  loading: boolean;
  onEdit?: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ userProfile, loading, onEdit }) => {
  // Helper function to format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Não informado';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data inválida';
    }
  };

  // Helper to get cargo text
  const getCargoText = () => {
    if (!userProfile?.cargo) return 'Não informado';
    
    if (typeof userProfile.cargo === 'string') {
      return userProfile.cargo;
    }
    
    return userProfile.cargo.descricao || 'Não informado';
  };
  
  // Helper to get coordenacao text
  const getCoordenacaoText = () => {
    if (!userProfile?.coordenacao) return 'Não informado';
    
    if (typeof userProfile.coordenacao === 'string') {
      return userProfile.coordenacao;
    }
    
    return userProfile.coordenacao.descricao || 'Não informado';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6 space-y-2">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-8 h-8 mr-3 flex items-center justify-center">
                  <Skeleton className="w-6 h-6 rounded-full" />
                </div>
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between">
          <CardTitle>Perfil do Usuário</CardTitle>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-8 space-y-2">
          <AvatarDisplay 
            nome={userProfile?.nome_completo || ""}
            imageSrc={userProfile?.foto_perfil_url || ""} 
            size="xl"
          />
          <h2 className="text-xl font-medium">{userProfile?.nome_completo || "Nome não informado"}</h2>
          <p className="text-gray-500">{getCargoText()}</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex">
            <div className="w-8 h-8 mr-3 flex items-center justify-center text-gray-500">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div>{userProfile?.email || "Não informado"}</div>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-8 h-8 mr-3 flex items-center justify-center text-gray-500">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">WhatsApp</div>
              <div>{userProfile?.whatsapp || "Não informado"}</div>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-8 h-8 mr-3 flex items-center justify-center text-gray-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Aniversário</div>
              <div>
                {userProfile?.aniversario ? formatDate(userProfile.aniversario) : "Não informado"}
              </div>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-8 h-8 mr-3 flex items-center justify-center text-gray-500">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Cargo</div>
              <div>{getCargoText()}</div>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-8 h-8 mr-3 flex items-center justify-center text-gray-500">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Coordenação</div>
              <div>{getCoordenacaoText()}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileView;
