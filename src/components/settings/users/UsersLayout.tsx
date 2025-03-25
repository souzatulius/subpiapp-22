
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from '@/components/ui/dropdown-menu';
import { UserPlus, Filter } from 'lucide-react';
import UsersDialogs from './UsersDialogs';
import UsersTable from './UsersTable';
import { UsersLayoutProps } from '@/types/users';

const UsersLayout: React.FC<UsersLayoutProps> = ({
  users,
  loading,
  filter,
  setFilter,
  supervisoesTecnicas,
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
  isEditSubmitting
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [filteredUsers, setFilteredUsers] = useState<typeof users>(users);

  // Apply filtering based on search text and status
  useEffect(() => {
    let filtered = users;
    
    // Filter by text
    if (filter) {
      const searchTerm = filter.toLowerCase();
      filtered = filtered.filter(user => 
        user.nome_completo?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.cargos?.descricao?.toLowerCase().includes(searchTerm) ||
        user.supervisao_tecnica?.descricao?.toLowerCase().includes(searchTerm) ||
        user.coordenacao?.descricao?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'todos') {
      if (statusFilter === 'ativos') {
        filtered = filtered.filter(user => 
          user.permissoes && user.permissoes.length > 0
        );
      } else if (statusFilter === 'inativos') {
        filtered = filtered.filter(user => 
          !user.permissoes || user.permissoes.length === 0
        );
      }
    }
    
    setFilteredUsers(filtered);
  }, [users, filter, statusFilter]);

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
        users={filteredUsers} 
        loading={loading} 
        filter={filter}
        onEdit={(user) => userActions.handleEdit(user)}
        onDelete={(user) => userActions.handleDelete(user)}
        onResetPassword={(user) => userActions.handleResetPassword(user)}
        onApprove={(user, roleName) => userActions.handleApprove(user, roleName)}
        onRemoveAccess={userActions.handleRemoveAccess}
        onManageRoles={userActions.handleManageRoles}
      />

      {/* Dialogs for user management */}
      <UsersDialogs
        supervisoesTecnicas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={coordenacoes}
        isInviteDialogOpen={isInviteDialogOpen}
        setIsInviteDialogOpen={setIsInviteDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        userToDelete={userToDelete}
        handleInviteUser={handleInviteUser}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        isEditSubmitting={isEditSubmitting}
      />
    </div>
  );
};

export default UsersLayout;
