import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { User } from './access-control/types';
import { useAccessControl } from './access-control/useAccessControl'; 
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const AccessControl: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'coordenadores' | 'supervisores'>('coordenadores');

  const {
    users,
    permissions,
    userPermissions,
    loading,
    saving,
    handleAddPermission,
    handleRemovePermission
  } = useAccessControl();
  
  const coordenadores = users.filter(user => user.type === 'coordenacao');
  const supervisores = users.filter(user => user.type === 'supervisao_tecnica');

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
      <h1 className="text-2xl font-bold tracking-tight">Controle de Acesso</h1>
      
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
                onAddPermission={handleAddPermissionAdapter}
                onRemovePermission={handleRemovePermissionAdapter}
                isSaving={saving}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessControl;

interface AccessControlTableProps {
  users: User[];
  permissions: any[];
  userPermissions: Record<string, string[]>;
  isLoading: boolean;
  onAddPermission: (userId: string, permissionId: string) => Promise<void>;
  onRemovePermission: (userId: string, permissionId: string) => Promise<void>;
  isSaving: boolean;
}

const AccessControlTable: React.FC<AccessControlTableProps> = ({
  users,
  permissions,
  userPermissions,
  onAddPermission,
  onRemovePermission,
  isSaving
}) => {
  return (
    <div className="space-y-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="text-left p-2 border-b">Nome</th>
            <th className="text-left p-2 border-b">Permissões</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-2 font-medium">{user.nome_completo}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
