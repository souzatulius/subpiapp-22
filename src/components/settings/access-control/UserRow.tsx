
import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Edit, Shield, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { User, Permission } from './types';
import PermissionSelect from './PermissionSelect';

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
  openEditDialog,
}) => {
  const isCurrentUser = user.id === currentUserId;
  
  return (
    <tr key={user.id}>
      <td className="px-4 py-3 text-sm">
        <div>
          <p className="font-medium">{user.nome_completo} {isCurrentUser && "(Você)"}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        <div>
          <p>WhatsApp: {user.whatsapp || '-'}</p>
          <p>Aniversário: {user.aniversario ? format(new Date(user.aniversario), 'dd/MM/yyyy', { locale: pt }) : '-'}</p>
        </div>
      </td>
      
      <td className="px-4 py-3">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {userPermissions && userPermissions.length > 0 ? (
              permissions
                .filter(p => userPermissions.includes(p.id))
                .map(permission => (
                  <Badge 
                    key={permission.id} 
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    <Shield className="h-3 w-3" />
                    {permission.descricao}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
                      onClick={() => handleRemovePermission(user.id, permission.id)}
                      disabled={saving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
            ) : (
              <span className="text-gray-500 text-sm">Sem permissões</span>
            )}
          </div>
          
          <PermissionSelect
            permissions={permissions}
            userPermissions={userPermissions || []}
            userId={user.id}
            onAddPermission={handleAddPermission}
            disabled={saving}
          />
        </div>
      </td>
      
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
