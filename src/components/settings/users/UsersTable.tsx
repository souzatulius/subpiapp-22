
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

interface UsersTableProps {
  users: User[];
  loading: boolean;
  filter: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  onApprove: (user: User) => void;
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
  // Function to determine if a user needs approval (no permissions assigned)
  const needsApproval = (user: User) => {
    // Check if the user has permission records in the userPermissions array
    return !user.permissoes || user.permissoes.length === 0;
  };

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
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                {filter ? 'Nenhum usuário encontrado com este filtro.' : 'Nenhum usuário cadastrado.'}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className={needsApproval(user) ? "bg-yellow-50" : ""}>
                <TableCell>
                  {needsApproval(user) ? (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Aguardando Aprovação
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Ativo
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{user.nome_completo}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cargos?.descricao || '-'}</TableCell>
                <TableCell>{user.areas_coordenacao?.descricao || '-'}</TableCell>
                <TableCell>{user.criado_em ? formatDateTime(user.criado_em) : '-'}</TableCell>
                <TableCell className="text-right space-x-1">
                  {needsApproval(user) ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onApprove(user)}
                      className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                  ) : (
                    <>
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
                        Redefinir Senha
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDelete(user)} 
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
