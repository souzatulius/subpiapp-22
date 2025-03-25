
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { UserPlus, Filter, Loader2 } from 'lucide-react';
import InviteUserDialog from './InviteUserDialog';
import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';
import UserActionsMenu from './UserActionsMenu';
import { UsersLayoutProps, User } from './types';

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Coordenação</TableHead>
              <TableHead>Supervisão Técnica</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-8">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nome_completo}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cargos?.descricao || '-'}</TableCell>
                  <TableCell>{user.areas_coordenacao?.coordenacao || '-'}</TableCell>
                  <TableCell>{user.areas_coordenacao?.descricao || '-'}</TableCell>
                  <TableCell>
                    {user.permissoes && user.permissoes.length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pendente
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserActionsMenu 
                      user={user} 
                      onEdit={() => userActions.handleEdit(user)}
                      onDelete={() => userActions.handleDelete(user)}
                      onResetPassword={() => userActions.handleResetPassword(user)}
                      onApprove={(permissionLevel) => userActions.handleApprove(user, permissionLevel)}
                      onRemoveAccess={() => userActions.handleRemoveAccess(user)}
                      isApproving={approving}
                      isRemoving={removing}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
      />
      
      <DeleteUserDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UsersLayout;
