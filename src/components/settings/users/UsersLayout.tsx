
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from '@/components/ui/dropdown-menu';
import { UserPlus, Filter, Loader2 } from 'lucide-react';
import InviteUserDialog from './InviteUserDialog';
import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';
import UserActionsMenu from './UserActionsMenu';
import { UsersLayoutProps } from './types';
import UsersTable from './UsersTable';

const UsersLayout: React.FC<UsersLayoutProps> = ({
  users,
  loading,
  filter,
  setFilter,
  areas,
  cargos,
  coordenacoes = [],
  isInviteDialogOpen,
  setIsInviteDialogOpen,
  handleInviteUser,
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedUser,
  handleEditUser,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  userToDelete,
  handleDeleteUser,
  userActions,
  approving,
  removing,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Buscar usuários..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>

        <div className="flex space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter === 'todos'
                  ? 'Todos'
                  : statusFilter === 'ativos'
                  ? 'Ativos'
                  : 'Pendentes'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <DropdownMenuRadioItem value="todos">
                  Todos
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ativos">
                  Ativos
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="inativos">
                  Pendentes
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Convidar
          </Button>
        </div>
      </div>

      <UsersTable 
        users={users} 
        loading={loading} 
        filter={filter}
        onEdit={(user) => userActions.handleEdit(user)}
        onDelete={(user) => userActions.handleDelete(user)}
        onResetPassword={(user) => userActions.handleResetPassword(user)}
        onApprove={(user, permissionLevel) => userActions.handleApprove(user, permissionLevel)}
        onRemoveAccess={userActions.handleRemoveAccess}
      />

      {/* Dialogs */}
      <InviteUserDialog 
        open={isInviteDialogOpen} 
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteUser}
        areas={areas}
        cargos={cargos}
        coordenacoes={coordenacoes}
      />
      
      <EditUserDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
        onSubmit={handleEditUser}
        areas={areas}
        cargos={cargos}
        coordenacoes={coordenacoes}
      />
      
      <DeleteUserDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={userToDelete}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default UsersLayout;
