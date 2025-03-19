
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAccessControl = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleAddPermission = async (userId: string, permissionId: string) => {
    if (!permissionId) return;
    
    setSaving(true);
    
    try {
      // Check if permission already exists to avoid duplicate
      const userPerms = userPermissions[userId] || [];
      if (userPerms.includes(permissionId)) {
        toast({
          title: 'Aviso',
          description: 'Esta permissão já foi atribuída ao usuário.',
        });
        setSaving(false);
        return;
      }
      
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

  return {
    users,
    permissions,
    userPermissions,
    loading,
    saving,
    filter,
    setFilter,
    filteredUsers,
    handleAddPermission,
    handleRemovePermission,
    handleExportCsv,
    handlePrint,
  };
};
