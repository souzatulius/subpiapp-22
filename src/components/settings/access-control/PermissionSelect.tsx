
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

  return (
    <div className="flex gap-2 mt-2">
      <Select
        value={selectedPermission}
        onValueChange={setSelectedPermission}
        disabled={disabled || availablePermissions.length === 0}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Adicionar permissão" />
        </SelectTrigger>
        <SelectContent>
          {availablePermissions.map((permission) => (
            <SelectItem key={permission.id} value={permission.id}>
              {permission.descricao}
            </SelectItem>
          ))}
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
