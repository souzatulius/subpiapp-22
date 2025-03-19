
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User, Permission, UserPermissionMapping } from './types';

export const useAccessControlData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionMapping>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    try {
      // Fetch users with whatsapp and aniversario
      const { data: usersData, error: usersError } = await supabase
        .from('usuarios')
        .select(`
          id, 
          nome_completo, 
          email,
          whatsapp,
          aniversario
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
      const userPerms: UserPermissionMapping = {};
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

  return {
    users,
    setUsers,
    permissions,
    userPermissions,
    setUserPermissions,
    loading,
    fetchData
  };
};
