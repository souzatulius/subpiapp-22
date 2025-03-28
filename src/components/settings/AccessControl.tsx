
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useAccessControlData } from './access-control/useAccessControlData';
import Coordenadores from './access-control/Coordenadores';
import SupervisoresTecnicos from './access-control/SupervisoresTecnicos';
import CustomTabs from '@/components/ui/tabs/CustomTabs';
import UserInfoDialog from './access-control/UserInfoDialog';
import { User } from './access-control/types';
import { usePermissionsManagement } from './access-control/usePermissionsManagement';

const AccessControl: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'coordenadores' | 'supervisores'>('coordenadores');
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const {
    coordenadores,
    supervisores,
    coordenacoes,
    userPermissions,
    allPermissions,
    isLoadingPermissions,
    fetchPermissions,
    fetchUserData
  } = useAccessControlData();
  
  const {
    saving,
    handleAddPermission,
    handleRemovePermission
  } = usePermissionsManagement(
    userPermissions,
    (newPermissions) => {
      fetchPermissions();
    },
    fetchUserData
  );

  const handleOpenUserInfo = (user: User) => {
    setSelectedUser(user);
    setUserInfoOpen(true);
  };

  const handleSaveUserInfo = async (userId: string, data: { whatsapp?: string; aniversario?: string }) => {
    try {
      const { whatsapp, aniversario } = data;
      
      // Lógica para atualizar informações do usuário no banco de dados
      console.log('Salvando dados do usuário:', userId, data);
      
      // Após salvar, atualize a lista de usuários
      fetchUserData();
      
      setUserInfoOpen(false);
    } catch (error) {
      console.error('Erro ao salvar informações do usuário:', error);
    }
  };

  // Adaptador para manter a compatibilidade com o uso dos handlers
  const handleAddPermissionAdapter = (userId: string, permissionId: string) => {
    return handleAddPermission(userId, permissionId, selectedTab === 'supervisores');
  };

  const handleRemovePermissionAdapter = (userId: string, permissionId: string) => {
    return handleRemovePermission(userId, permissionId, selectedTab === 'supervisores');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Controle de Acesso</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <CustomTabs
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as 'coordenadores' | 'supervisores')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coordenadores">Coordenadores</TabsTrigger>
              <TabsTrigger value="supervisores">Supervisores Técnicos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="coordenadores" className="mt-6">
              <Coordenadores 
                coordenadores={coordenadores}
                coordenacoes={coordenacoes}
                userPermissions={userPermissions}
                allPermissions={allPermissions}
                isLoading={isLoadingPermissions}
                onOpenUserInfo={handleOpenUserInfo}
                onAddPermission={handleAddPermissionAdapter}
                onRemovePermission={handleRemovePermissionAdapter}
                isSaving={saving}
              />
            </TabsContent>
            
            <TabsContent value="supervisores" className="mt-6">
              <SupervisoresTecnicos 
                supervisores={supervisores}
                userPermissions={userPermissions}
                allPermissions={allPermissions}
                isLoading={isLoadingPermissions}
                onOpenUserInfo={handleOpenUserInfo}
                onAddPermission={handleAddPermissionAdapter}
                onRemovePermission={handleRemovePermissionAdapter}
                isSaving={saving}
              />
            </TabsContent>
          </CustomTabs>
        </CardContent>
      </Card>
      
      <UserInfoDialog
        open={userInfoOpen}
        onOpenChange={setUserInfoOpen}
        user={selectedUser}
        onSave={handleSaveUserInfo}
      />
    </div>
  );
};

export default AccessControl;
