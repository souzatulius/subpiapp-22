
import React, { useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Permission } from './types';
import { toast } from '@/components/ui/use-toast';

interface PermissionSelectProps {
  permissions: Permission[];
  userPermissions: string[];
  userId: string;
  onAddPermission: (userId: string, permissionId: string) => Promise<void>;
  disabled?: boolean;
}

const PermissionSelect: React.FC<PermissionSelectProps> = ({
  permissions,
  userPermissions,
  userId,
  onAddPermission,
  disabled = false,
}) => {
  const [selectedPermission, setSelectedPermission] = React.useState<string>('');
  const [isAddingPermission, setIsAddingPermission] = React.useState(false);
  
  // Filter out permissions that the user already has
  const availablePermissions = permissions.filter(
    permission => !userPermissions.includes(permission.id)
  );

  // Sort permissions by nivel_acesso (highest to lowest)
  const sortedAvailablePermissions = [...availablePermissions].sort(
    (a, b) => b.nivel_acesso - a.nivel_acesso
  );

  const handleAddPermission = async () => {
    if (selectedPermission) {
      setIsAddingPermission(true);
      try {
        await onAddPermission(userId, selectedPermission);
        setSelectedPermission('');
        toast({
          title: "Sucesso",
          description: "Permissão adicionada com sucesso",
        });
      } catch (error) {
        console.error("Erro ao adicionar permissão:", error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a permissão",
          variant: "destructive",
        });
      } finally {
        setIsAddingPermission(false);
      }
    }
  };

  // Log debugging information
  useEffect(() => {
    console.log('PermissionSelect props:', {
      userId,
      permissionsCount: permissions.length,
      userPermissionsCount: userPermissions.length,
      availablePermissionsCount: availablePermissions.length,
      disabled
    });
    
    if (permissions.length === 0) {
      console.warn('Nenhuma permissão disponível no sistema');
    }
    
    if (availablePermissions.length === 0 && permissions.length > 0) {
      console.log('Usuário já possui todas as permissões disponíveis');
    }
  }, [permissions, userPermissions, userId, availablePermissions.length, disabled]);

  return (
    <div className="flex gap-2 mt-2">
      <Select
        value={selectedPermission}
        onValueChange={setSelectedPermission}
        disabled={disabled || isAddingPermission}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Adicionar permissão" />
        </SelectTrigger>
        <SelectContent>
          {sortedAvailablePermissions.length > 0 ? (
            sortedAvailablePermissions.map((permission) => (
              <SelectItem key={permission.id} value={permission.id}>
                {permission.name} (Nível {permission.nivel_acesso})
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-permissions-available">
              {permissions.length === 0 
                ? "Nenhuma permissão cadastrada" 
                : "Não há permissões disponíveis"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <Button 
        onClick={handleAddPermission} 
        disabled={disabled || isAddingPermission || !selectedPermission}
        variant="outline"
      >
        {isAddingPermission ? "Adicionando..." : "Adicionar"}
      </Button>
    </div>
  );
};

export default PermissionSelect;
