
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
      
      // If no permissions found, check if we need to create default ones
      if (!permissionsData || permissionsData.length === 0) {
        console.log('No permissions found, checking if we need to create default ones');
        await createDefaultPermissionsIfNeeded();
        
        // Fetch permissions again after creating defaults
        const { data: newPermissionsData, error: newPermissionsError } = await supabase
          .from('permissoes')
          .select('id, descricao, nivel_acesso');
          
        if (newPermissionsError) throw newPermissionsError;
        
        if (newPermissionsData) {
          setPermissions(newPermissionsData);
        }
      } else {
        setPermissions(permissionsData);
      }
      
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

  // Function to create default permissions if none exist
  async function createDefaultPermissionsIfNeeded() {
    const defaultPermissions = [
      { descricao: 'Admin', nivel_acesso: 100 },
      { descricao: 'Subprefeito', nivel_acesso: 90 },
      { descricao: 'Time de Comunicação', nivel_acesso: 80 },
      { descricao: 'Gestores', nivel_acesso: 70 },
      { descricao: 'Restrito', nivel_acesso: 10 }
    ];
    
    try {
      // Check if permissions already exist
      const { count, error } = await supabase
        .from('permissoes')
        .select('id', { count: 'exact', head: true });
        
      if (error) throw error;
      
      // If no permissions exist, create the defaults
      if (count === 0) {
        console.log('Creating default permissions');
        
        for (const perm of defaultPermissions) {
          const { error } = await supabase
            .from('permissoes')
            .insert(perm);
            
          if (error) throw error;
        }
        
        toast({
          title: 'Permissões criadas',
          description: 'As permissões padrão foram criadas com sucesso.',
        });
      }
    } catch (error: any) {
      console.error('Erro ao criar permissões padrão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar as permissões padrão.',
        variant: 'destructive',
      });
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
