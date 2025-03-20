
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Permission } from './types';

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
  
  // Filter out permissions that the user already has
  const availablePermissions = permissions.filter(
    permission => !userPermissions.includes(permission.id)
  );

  const handleAddPermission = async () => {
    if (selectedPermission) {
      await onAddPermission(userId, selectedPermission);
      setSelectedPermission('');
    }
  };

  // Mostrar mensagem de debug no console
  console.log('PermissionSelect props:', {
    permissions,
    userPermissions,
    availablePermissions,
    disabled
  });

  return (
    <div className="flex gap-2 mt-2">
      <Select
        value={selectedPermission}
        onValueChange={setSelectedPermission}
        disabled={disabled}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Adicionar permissão" />
        </SelectTrigger>
        <SelectContent>
          {availablePermissions.length > 0 ? (
            availablePermissions.map((permission) => (
              <SelectItem key={permission.id} value={permission.id}>
                {permission.descricao}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-permissions" disabled>
              Não há permissões disponíveis
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <Button 
        onClick={handleAddPermission} 
        disabled={disabled || !selectedPermission}
        variant="outline"
      >
        Adicionar
      </Button>
    </div>
  );
};

export default PermissionSelect;
