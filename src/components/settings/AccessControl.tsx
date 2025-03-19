
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Shield, Download, Printer, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AccessControl = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('usuarios')
          .select(`
            id, 
            nome_completo, 
            email
          `);
          
        if (usersError) throw usersError;
        
        // Fetch permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissoes')
          .select('id, descricao, nivel_acesso');
          
        if (permissionsError) throw permissionsError;
        
        // Fetch user permissions
        const { data: userPermissionsData, error: userPermissionsError } = await supabase
          .from('usuario_permissoes')
          .select('usuario_id, permissao_id');
          
        if (userPermissionsError) throw userPermissionsError;
        
        // Process user permissions
        const userPerms: Record<string, string[]> = {};
        userPermissionsData?.forEach(up => {
          if (!userPerms[up.usuario_id]) {
            userPerms[up.usuario_id] = [];
          }
          userPerms[up.usuario_id].push(up.permissao_id);
        });
        
        setUsers(usersData || []);
        setPermissions(permissionsData || []);
        setUserPermissions(userPerms);
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados. Por favor, tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handlePermissionChange = async (userId: string, permissionId: string, checked: boolean) => {
    setSaving(true);
    
    try {
      if (checked) {
        // Add permission
        const { error } = await supabase
          .from('usuario_permissoes')
          .insert({
            usuario_id: userId,
            permissao_id: permissionId,
          });
          
        if (error) throw error;
        
        // Update local state
        setUserPermissions(prev => ({
          ...prev,
          [userId]: [...(prev[userId] || []), permissionId],
        }));
      } else {
        // Remove permission
        const { error } = await supabase
          .from('usuario_permissoes')
          .delete()
          .match({
            usuario_id: userId,
            permissao_id: permissionId,
          });
          
        if (error) throw error;
        
        // Update local state
        setUserPermissions(prev => ({
          ...prev,
          [userId]: (prev[userId] || []).filter(id => id !== permissionId),
        }));
      }
      
      toast({
        title: 'Permissão atualizada',
        description: 'As permissões do usuário foram atualizadas com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar a permissão.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddPermission = async (userId: string, permissionId: string) => {
    if (!permissionId) return;
    
    setSaving(true);
    
    try {
      // Add permission
      const { error } = await supabase
        .from('usuario_permissoes')
        .insert({
          usuario_id: userId,
          permissao_id: permissionId,
        });
        
      if (error) throw error;
      
      // Update local state
      setUserPermissions(prev => ({
        ...prev,
        [userId]: [...(prev[userId] || []), permissionId],
      }));
      
      toast({
        title: 'Permissão adicionada',
        description: 'A permissão foi adicionada com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao adicionar permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar a permissão.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePermission = async (userId: string, permissionId: string) => {
    setSaving(true);
    
    try {
      // Remove permission
      const { error } = await supabase
        .from('usuario_permissoes')
        .delete()
        .match({
          usuario_id: userId,
          permissao_id: permissionId,
        });
        
      if (error) throw error;
      
      // Update local state
      setUserPermissions(prev => ({
        ...prev,
        [userId]: (prev[userId] || []).filter(id => id !== permissionId),
      }));
      
      toast({
        title: 'Permissão removida',
        description: 'A permissão foi removida com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao remover permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao remover a permissão.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = () => {
    // Create CSV data
    const headers = ['Nome', 'Email', 'Permissões'];
    const csvData = users.map(user => {
      const userPerms = userPermissions[user.id] || [];
      const permissionNames = userPerms
        .map(permId => {
          const perm = permissions.find(p => p.id === permId);
          return perm ? perm.descricao : '';
        })
        .filter(Boolean)
        .join('; ');
      
      return [
        user.nome_completo,
        user.email,
        permissionNames
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => {
        // Handle commas and quotes in CSV
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(','))
    ].join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'controle_acesso.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredUsers = users.filter(user => {
    const searchTerms = filter.toLowerCase();
    return (
      user.nome_completo?.toLowerCase().includes(searchTerms) ||
      user.email?.toLowerCase().includes(searchTerms)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Controle de Acesso</h2>
          <p className="text-gray-500">Gerencie as permissões de acesso dos usuários</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Buscar usuários..." 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleExportCsv} title="Exportar CSV">
              <Download className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={handlePrint} title="Imprimir">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h3 className="text-blue-800 font-semibold flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4" />
          Sobre as permissões
        </h3>
        <p className="text-blue-700">
          As permissões controlam o que cada usuário pode fazer na plataforma. 
          Diferentes níveis de permissão dão acesso a diferentes funcionalidades.
        </p>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Permissões</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]" />
                  <p className="mt-2">Carregando dados...</p>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {filter ? 'Nenhum usuário encontrado para a busca' : 'Nenhum usuário cadastrado'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const userPerms = userPermissions[user.id] || [];
                const availablePermissions = permissions.filter(p => !userPerms.includes(p.id));
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.nome_completo}</div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {userPerms.length === 0 ? (
                          <span className="text-gray-500">Nenhuma permissão atribuída</span>
                        ) : (
                          userPerms.map(permissionId => {
                            const permission = permissions.find(p => p.id === permissionId);
                            
                            return permission ? (
                              <div key={permissionId} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full text-xs">
                                <span>{permission.descricao}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => handleRemovePermission(user.id, permissionId)}
                                  disabled={saving}
                                >
                                  ×
                                </Button>
                              </div>
                            ) : null;
                          })
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          onValueChange={(value) => handleAddPermission(user.id, value)}
                          disabled={saving || availablePermissions.length === 0}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Adicionar permissão" />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePermissions.map((permission) => (
                              <SelectItem key={permission.id} value={permission.id}>
                                {permission.descricao}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AccessControl;
