
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { User } from './access-control/types';
import { useAccessControl } from './access-control/useAccessControl'; 
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const AccessControl: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'coordenadores' | 'supervisores'>('coordenadores');
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const {
    users,
    permissions,
    userPermissions,
    loading,
    saving,
    handleAddPermission,
    handleRemovePermission,
    openEditDialog,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    handleUpdateUserInfo
  } = useAccessControl();
  
  // Filter users based on tab
  const coordenadores = users.filter(user => user.type === 'coordenacao');
  const supervisores = users.filter(user => user.type === 'supervisao_tecnica');

  const handleOpenUserInfo = (user: User) => {
    setSelectedUser(user);
    setUserInfoOpen(true);
  };

  const handleSaveUserInfo = async (userId: string, data: { whatsapp?: string; aniversario?: string }) => {
    try {
      // Update user info and refresh data
      await handleUpdateUserInfo(userId, data);
      setUserInfoOpen(false);
    } catch (error) {
      console.error('Erro ao salvar informações do usuário:', error);
    }
  };

  // Adaptadores para manter a compatibilidade com o uso dos handlers
  const handleAddPermissionAdapter = (userId: string, permissionId: string) => {
    return handleAddPermission(userId, permissionId, selectedTab === 'supervisores');
  };

  const handleRemovePermissionAdapter = (userId: string, permissionId: string) => {
    return handleRemovePermission(userId, permissionId, selectedTab === 'supervisores');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Carregando controle de acesso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Controle de Acesso</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as 'coordenadores' | 'supervisores')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coordenadores">Coordenadores</TabsTrigger>
              <TabsTrigger value="supervisores">Supervisores Técnicos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="coordenadores" className="mt-6">
              <AccessControlTable 
                users={coordenadores}
                permissions={permissions}
                userPermissions={userPermissions}
                isLoading={loading}
                onOpenUserInfo={handleOpenUserInfo}
                onAddPermission={handleAddPermissionAdapter}
                onRemovePermission={handleRemovePermissionAdapter}
                isSaving={saving}
              />
            </TabsContent>
            
            <TabsContent value="supervisores" className="mt-6">
              <AccessControlTable 
                users={supervisores}
                permissions={permissions}
                userPermissions={userPermissions}
                isLoading={loading}
                onOpenUserInfo={handleOpenUserInfo}
                onAddPermission={handleAddPermissionAdapter}
                onRemovePermission={handleRemovePermissionAdapter}
                isSaving={saving}
              />
            </TabsContent>
          </Tabs>
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

interface AccessControlTableProps {
  users: User[];
  permissions: any[];
  userPermissions: Record<string, string[]>;
  isLoading: boolean;
  onOpenUserInfo: (user: User) => void;
  onAddPermission: (userId: string, permissionId: string) => Promise<void>;
  onRemovePermission: (userId: string, permissionId: string) => Promise<void>;
  isSaving: boolean;
}

// Common table component for both tabs
const AccessControlTable: React.FC<AccessControlTableProps> = ({
  users,
  permissions,
  userPermissions,
  isLoading,
  onOpenUserInfo,
  onAddPermission,
  onRemovePermission,
  isSaving
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Nenhum registro encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="text-left p-2 border-b">Nome</th>
            <th className="text-left p-2 border-b">Permissões</th>
            <th className="text-right p-2 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-2">
                <div className="font-medium">{user.nome_completo}</div>
              </td>
              <td className="p-2">
                <div className="flex flex-wrap gap-1">
                  {permissions.map(permission => {
                    const hasPermission = userPermissions[user.id]?.includes(permission.id);
                    
                    return (
                      <Button
                        key={permission.id}
                        size="sm"
                        variant={hasPermission ? "default" : "outline"}
                        className={`text-xs py-1 h-7 ${isSaving ? 'opacity-50' : ''}`}
                        onClick={() => {
                          if (hasPermission) {
                            onRemovePermission(user.id, permission.id);
                          } else {
                            onAddPermission(user.id, permission.id);
                          }
                        }}
                        disabled={isSaving}
                      >
                        {permission.name}
                      </Button>
                    );
                  })}
                </div>
              </td>
              <td className="p-2 text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onOpenUserInfo(user)}
                >
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Define a simple UserInfoDialog component
const UserInfoDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (userId: string, data: { whatsapp?: string; aniversario?: string }) => Promise<void>;
}> = ({ open, onOpenChange, user, onSave }) => {
  const [whatsapp, setWhatsapp] = useState('');
  const [aniversario, setAniversario] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Set initial values when user changes
  React.useEffect(() => {
    if (user) {
      setWhatsapp(user.whatsapp || '');
      setAniversario(user.aniversario || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await onSave(user.id, {
        whatsapp,
        aniversario
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{user?.nome_completo}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(99) 99999-9999"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Aniversário</label>
            <input 
              type="date"
              className="w-full p-2 border rounded"
              value={aniversario}
              onChange={(e) => setAniversario(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
