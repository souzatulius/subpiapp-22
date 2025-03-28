
import React from 'react';
import { User, Permission } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface UserRowProps {
  user: User;
  permissions: Permission[];
  userPermissions: string[];
  saving: boolean;
  currentUserId: string | null;
  handleAddPermission: (userId: string, permissionId: string) => Promise<void>;
  handleRemovePermission: (userId: string, permissionId: string) => Promise<void>;
  openEditDialog: (user: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({
  user,
  permissions,
  userPermissions,
  saving,
  currentUserId,
  handleAddPermission,
  handleRemovePermission,
  openEditDialog
}) => {
  // Determine type of entity (coordenação or supervisão técnica)
  const entityType = user.supervisao_tecnica_id ? 'Supervisão Técnica' : 'Coordenação';
  
  // Handle permission toggle
  const handlePermissionToggle = async (permissionId: string, checked: boolean) => {
    if (checked) {
      await handleAddPermission(user.id, permissionId);
    } else {
      await handleRemovePermission(user.id, permissionId);
    }
  };
  
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{user.nome_completo}</span>
          <span className="text-xs text-gray-500">{entityType}</span>
        </div>
      </td>
      
      {permissions.map(permission => (
        <td key={permission.id} className="px-6 py-4 whitespace-nowrap text-center">
          <Checkbox
            checked={userPermissions.includes(permission.id)}
            onCheckedChange={(checked) => 
              handlePermissionToggle(permission.id, checked as boolean)
            }
            disabled={saving}
            className="mx-auto"
          />
        </td>
      ))}
      
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openEditDialog(user)}
          className="text-gray-500 hover:text-blue-600"
        >
          <Edit size={16} />
        </Button>
      </td>
    </tr>
  );
};

export default UserRow;
