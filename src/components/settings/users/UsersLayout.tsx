
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, UsersLayoutProps } from './types';
import UsersTable from './UsersTable';
import UserDialogs from './UserDialogs';
import { FileSpreadsheet, RefreshCw, UserPlus } from 'lucide-react';
import EditUserDialog from './EditUserDialog';

const UsersLayout: React.FC<UsersLayoutProps> = ({
  users,
  loading,
  filter,
  setFilter,
  supervisoesTecnicas,
  cargos,
  coordenacoes,
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
  isEditSubmitting,
  onRefresh
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar usuários..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              onClick={onRefresh}
              title="Atualizar lista"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          )}
          <Button 
            variant="outline"
            className="gap-2"
            onClick={() => {}}
            title="Exportar lista de usuários"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar
          </Button>
          <Button 
            onClick={() => setIsInviteDialogOpen(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Convidar Usuário
          </Button>
        </div>
      </div>

      <UsersTable
        users={users}
        loading={loading}
        filter={filter}
        onEdit={userActions.handleEdit}
        onDelete={userActions.handleDelete}
        onResetPassword={userActions.handleResetPassword}
        onApprove={userActions.handleApprove}
        onRemoveAccess={userActions.handleRemoveAccess}
      />

      <UserDialogs
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

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
        onSubmit={handleEditUser}
        supervisoesTecnicas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={coordenacoes}
        isSubmitting={isEditSubmitting}
      />
    </div>
  );
};

export default UsersLayout;
