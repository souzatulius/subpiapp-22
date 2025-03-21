
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Trash, SendHorizontal, XCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { User } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  filter: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  onApprove: (user: User, permissionLevel?: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  filter,
  onEdit,
  onDelete,
  onResetPassword,
  onApprove
}) => {
  // Filter users that need approval - users without permissions
  const pendingUsers = users.filter(user => !user.permissoes || user.permissoes.length === 0);
  const activeUsers = users.filter(user => user.permissoes && user.permissoes.length > 0);

  // Function to render the approval permission selection
  const renderApprovalSection = (user: User) => {
    const [selectedPermission, setSelectedPermission] = React.useState("Restrito");
    
    return (
      <div className="flex items-center space-x-2">
        <Select 
          defaultValue="Restrito"
          onValueChange={setSelectedPermission}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Nível de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Restrito">Restrito</SelectItem>
            <SelectItem value="Gestores">Gestores</SelectItem>
            <SelectItem value="Time de Comunicação">Comunicação</SelectItem>
            <SelectItem value="Subprefeito">Subprefeito</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onApprove(user, selectedPermission)}
          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Aprovar
        </Button>
      </div>
    );
  };

  // Function to render the pending users table
  const renderPendingUsersTable = () => {
    if (pendingUsers.length === 0) return null;
    
    return (
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-medium">Usuários Aguardando Aprovação</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id} className="bg-yellow-50">
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Aguardando Aprovação
                    </Badge>
                  </TableCell>
                  <TableCell>{user.nome_completo}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cargos?.descricao || '-'}</TableCell>
                  <TableCell>{user.areas_coordenacao?.descricao || '-'}</TableCell>
                  <TableCell>{user.criado_em ? formatDateTime(user.criado_em) : '-'}</TableCell>
                  <TableCell>
                    {renderApprovalSection(user)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // Function to render the active users table
  const renderActiveUsersTable = () => {
    if (activeUsers.length === 0 && pendingUsers.length === 0) {
      return (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {filter ? 'Nenhum usuário encontrado com este filtro.' : 'Nenhum usuário cadastrado.'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    }
    
    if (activeUsers.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Usuários Ativos</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Ativo
                    </Badge>
                  </TableCell>
                  <TableCell>{user.nome_completo}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cargos?.descricao || '-'}</TableCell>
                  <TableCell>{user.areas_coordenacao?.descricao || '-'}</TableCell>
                  <TableCell>
                    {user.permissoes ? user.permissoes.map(p => 
                      <Badge key={p.id} className="bg-blue-100 text-blue-800 mr-1 mb-1">
                        {p.descricao}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onResetPassword(user)}
                    >
                      <SendHorizontal className="h-4 w-4 mr-1" />
                      Senha
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(user)} 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {renderPendingUsersTable()}
      {renderActiveUsersTable()}
    </div>
  );
};

export default UsersTable;
