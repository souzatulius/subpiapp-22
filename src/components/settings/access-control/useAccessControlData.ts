
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User, Permission, UserPermissionMapping } from './types';

export const useAccessControlData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionMapping>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching access control data...');
      
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
      
      // Set total user count
      setTotalUsers(usersData?.length || 0);
      
      // Fetch permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissoes')
        .select('id, descricao, nivel_acesso')
        .order('nivel_acesso', { ascending: false });
        
      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        throw permissionsError;
      }
      
      console.log('Permissions fetched:', permissionsData?.length || 0, 'items', permissionsData);
      
      // Create default permissions if none exist using the function we created
      if (!permissionsData || permissionsData.length === 0) {
        console.log('No permissions found, creating defaults...');
        try {
          // Try to create default permissions using our function
          const { error: createError } = await supabase.rpc('create_default_permissions');
          
          if (createError) {
            console.error('Error creating default permissions:', createError);
            throw createError;
          }
          
          // Fetch permissions again after creating defaults
          const { data: newPermissionsData, error: newPermissionsError } = await supabase
            .from('permissoes')
            .select('id, descricao, nivel_acesso')
            .order('nivel_acesso', { ascending: false });
            
          if (newPermissionsError) throw newPermissionsError;
          
          if (newPermissionsData && newPermissionsData.length > 0) {
            console.log('Default permissions created successfully:', newPermissionsData.length, 'items');
            setPermissions(newPermissionsData);
          } else {
            throw new Error('Failed to create default permissions');
          }
        } catch (error) {
          console.error('Failed to create/fetch default permissions:', error);
          toast({
            title: 'Erro nas permissões',
            description: 'Não foi possível criar ou buscar as permissões padrão. Por favor, contate o administrador.',
            variant: 'destructive',
          });
        }
      } else {
        setPermissions(permissionsData);
      }
      
      // Fetch user permissions (based on roles table now)
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('usuario_roles')
        .select(`
          usuario_id,
          role_id,
          roles:role_id(id, role_nome, descricao)
        `);
        
      if (userRolesError) throw userRolesError;
      
      // Process user permissions from roles
      const userPerms: UserPermissionMapping = {};
      userRolesData?.forEach(ur => {
        if (!userPerms[ur.usuario_id]) {
          userPerms[ur.usuario_id] = [];
        }
        if (ur.roles && typeof ur.roles === 'object') {
          // Convert role to permission ID format (for compatibility)
          const roleId = `role_${ur.role_id}`;
          if (!userPerms[ur.usuario_id].includes(roleId)) {
            userPerms[ur.usuario_id].push(roleId);
          }
        }
      });
      
      // Also get the classic permissions for backward compatibility
      const { data: userPermissionsData, error: userPermissionsError } = await supabase
        .from('usuario_permissoes')
        .select('usuario_id, permissao_id');
        
      if (!userPermissionsError && userPermissionsData) {
        userPermissionsData.forEach(up => {
          if (!userPerms[up.usuario_id]) {
            userPerms[up.usuario_id] = [];
          }
          userPerms[up.usuario_id].push(up.permissao_id);
        });
      }
      
      setUsers(usersData || []);
      setUserPermissions(userPerms);
      console.log('Access control data loaded successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido';
      console.error('Erro ao carregar dados de controle de acesso:', error);
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: `Não foi possível carregar os dados de controle de acesso: ${errorMessage}`,
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
    error,
    fetchData,
    totalUsers
  };
};
