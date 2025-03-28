
import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

const UserPermissionsList = () => {
  const { users, loading, error } = useUsersList();
  const [allUsers, setAllUsers] = useState([]);
  const [fetchingAllUsers, setFetchingAllUsers] = useState(false);
  
  useEffect(() => {
    const fetchAllUsers = async () => {
      setFetchingAllUsers(true);
      try {
        // Fetch all users with their permissions
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            id,
            nome_completo,
            email,
            cargo_id,
            coordenacao_id,
            supervisao_tecnica_id,
            usuario_permissoes (
              permissao_id,
              permissoes:permissao_id (
                id,
                descricao,
                nivel_acesso
              )
            )
          `);
        
        if (error) throw error;
        
        // Transform data to include highest permission level
        const usersWithPermissions = data.map(user => {
          // Get highest permission level
          const permissions = user.usuario_permissoes || [];
          const highestPermission = permissions.reduce(
            (highest, current) => {
              const nivel = current.permissoes?.nivel_acesso || 0;
              return nivel > highest ? nivel : highest;
            }, 
            0
          );
          
          return {
            ...user,
            nivel_acesso: highestPermission,
            permissoes: permissions.map(p => p.permissoes?.descricao || '').filter(Boolean)
          };
        });
        
        setAllUsers(usersWithPermissions);
      } catch (error) {
        console.error('Error fetching all users:', error);
      } finally {
        setFetchingAllUsers(false);
      }
    };
    
    fetchAllUsers();
  }, []);
  
  if (loading || fetchingAllUsers) {
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
  
  // Use allUsers if available, fallback to users from the hook
  const displayUsers = allUsers.length > 0 ? allUsers : users;
  
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
            {displayUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              displayUsers.map(user => (
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
