
import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { User, Permission } from './types';
import UserPermissionRow from './UserPermissionRow';

interface UserRowProps {
  user: User;
  permissions: Permission[];
  userPermissions: string[];
  saving: boolean;
  handleAddPermission: (userId: string, permissionId: string) => Promise<void>;
  handleRemovePermission: (userId: string, permissionId: string) => Promise<void>;
  openEditDialog: (user: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({
  user,
  permissions,
  userPermissions,
  saving,
  handleAddPermission,
  handleRemovePermission,
  openEditDialog,
}) => {
  return (
    <tr key={user.id}>
      <td className="px-4 py-3 text-sm">
        <div>
          <p className="font-medium">{user.nome_completo}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        <div>
          <p>WhatsApp: {user.whatsapp || '-'}</p>
          <p>Aniversário: {user.aniversario ? format(new Date(user.aniversario), 'dd/MM/yyyy', { locale: pt }) : '-'}</p>
        </div>
      </td>
      
      {permissions.map((permission) => (
        <td key={permission.id} className="px-4 py-3 text-center">
          <UserPermissionRow
            user={user}
            permission={permission}
            userPermissions={userPermissions || []}
            saving={saving}
            handleAddPermission={handleAddPermission}
            handleRemovePermission={handleRemovePermission}
          />
        </td>
      ))}
      
      <td className="px-4 py-3 text-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => openEditDialog(user)}
          className="inline-flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </td>
    </tr>
  );
};

export default UserRow;
