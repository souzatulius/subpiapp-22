
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
import { CheckCircle, Edit, Trash, SendHorizontal, Shield, XCircle } from 'lucide-react';
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
  onRemoveAccess?: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  filter,
  onEdit,
  onDelete,
  onResetPassword,
  onApprove,
  onRemoveAccess
}) => {
  const pendingUsers = users.filter(user => !user.permissoes || user.permissoes.length === 0);
  const activeUsers = users.filter(user => user.permissoes && user.permissoes.length > 0);

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
                <TableHead>Coordenação</TableHead>
                <TableHead>Supervisão Técnica</TableHead>
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
                  <TableCell>{user.areas_coordenacao?.coordenacao || '-'}</TableCell>
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
                <TableHead>Coordenação</TableHead>
                <TableHead>Supervisão Técnica</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
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
                <TableHead>Coordenação</TableHead>
                <TableHead>Supervisão Técnica</TableHead>
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
                  <TableCell>{user.areas_coordenacao?.coordenacao || '-'}</TableCell>
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
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onEdit(user)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onResetPassword(user)}
                      title="Redefinir Senha"
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                    {onRemoveAccess && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                        onClick={() => onRemoveAccess(user)}
                        title="Gerenciar Acesso"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onDelete(user)}
                      title="Excluir"
                    >
                      <Trash className="h-4 w-4" />
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
              <TableHead>Coordenação</TableHead>
              <TableHead>Supervisão Técnica</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
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
