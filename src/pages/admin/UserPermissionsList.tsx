
import React from 'react';
import { useUsersList } from '@/hooks/admin/useUsersList';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const UserPermissionsList = () => {
  const { users, loading, error } = useUsersList();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Carregando usuários...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <h3 className="text-lg font-semibold">Erro</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuários e Permissões</h1>
      
      <div className="bg-white rounded-md shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Coordenação</TableHead>
              <TableHead>Supervisão Técnica</TableHead>
              <TableHead>Permissões</TableHead>
              <TableHead>Nível de Acesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nome_completo}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cargo}</TableCell>
                  <TableCell>{user.coordenacao}</TableCell>
                  <TableCell>{user.supervisao_tecnica || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissoes.length === 0 ? (
                        <span className="text-gray-400 text-sm italic">Sem permissões</span>
                      ) : (
                        user.permissoes.map((permission, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {permission}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`
                        ${user.nivel_acesso >= 90 ? 'bg-red-100 text-red-800' : 
                          user.nivel_acesso >= 70 ? 'bg-amber-100 text-amber-800' : 
                          user.nivel_acesso >= 50 ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}
                    >
                      {user.nivel_acesso}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserPermissionsList;
