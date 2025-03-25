
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { useUserRoles } from './hooks/useUserRoles';

interface Role {
  id: number;
  role_nome: string;
  descricao: string;
}

interface Coordenacao {
  id: string;
  descricao: string;
  sigla?: string;
}

interface SupervisaoTecnica {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
}

interface UserRole {
  id: string;
  role_id: number;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  role?: {
    role_nome: string;
    descricao: string;
  };
  coordenacao?: {
    descricao: string;
  };
  supervisao_tecnica?: {
    descricao: string;
  };
}

interface UserRolesManagerProps {
  userId: string;
  onRolesChange?: () => void;
}

const UserRolesManager: React.FC<UserRolesManagerProps> = ({ userId, onRolesChange }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<Coordenacao[]>([]);
  const [supervisoes, setSupervisoes] = useState<SupervisaoTecnica[]>([]);
  const [loading, setLoading] = useState(true);
  const { updating, addRole, removeRole } = useUserRoles(() => fetchUserRoles());
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedCoord, setSelectedCoord] = useState<string>('');
  const [selectedSuper, setSelectedSuper] = useState<string>('');
  const [filteredSupervisoes, setFilteredSupervisoes] = useState<SupervisaoTecnica[]>([]);
  
  // Fetch all available roles, coordenações, and supervisões
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*')
          .order('id');
          
        if (rolesError) throw rolesError;
        setRoles(rolesData || []);
        
        // Fetch coordenações
        const { data: coordData, error: coordError } = await supabase
          .from('coordenacoes')
          .select('*')
          .order('descricao');
          
        if (coordError) throw coordError;
        setCoordenacoes(coordData || []);
        
        // Fetch supervisões
        const { data: superData, error: superError } = await supabase
          .from('supervisoes_tecnicas')
          .select('*')
          .order('descricao');
          
        if (superError) throw superError;
        setSupervisoes(superData || []);
        
        await fetchUserRoles();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchData();
    }
  }, [userId]);
  
  // Update filtered supervisões when coordenação changes
  useEffect(() => {
    if (selectedCoord) {
      setFilteredSupervisoes(
        supervisoes.filter(s => s.coordenacao_id === selectedCoord)
      );
    } else {
      setFilteredSupervisoes([]);
    }
    // Reset selected supervisão when coordenação changes
    setSelectedSuper('');
  }, [selectedCoord, supervisoes]);

  async function fetchUserRoles() {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('usuario_roles')
        .select(`
          id,
          role_id,
          coordenacao_id,
          supervisao_tecnica_id,
          roles:role_id(id, role_nome, descricao),
          coordenacao:coordenacao_id(id, descricao),
          supervisao_tecnica:supervisao_tecnica_id(id, descricao)
        `)
        .eq('usuario_id', userId);
        
      if (error) throw error;
      setUserRoles(data || []);
      
      if (onRolesChange) {
        onRolesChange();
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as permissões do usuário.',
        variant: 'destructive',
      });
    }
  }

  const handleToggleRole = async (role: Role, checked: boolean) => {
    if (!userId) return;
    
    try {
      if (checked) {
        // Add role
        await addRole(userId, role.id);
      } else {
        // Find the role entry to remove (without context)
        const roleEntry = userRoles.find(ur => 
          ur.role_id === role.id && 
          !ur.coordenacao_id && 
          !ur.supervisao_tecnica_id
        );
        
        if (roleEntry) {
          await removeRole(userId, role.id);
        }
      }
      
      // Refresh user roles after changes
      await fetchUserRoles();
    } catch (error) {
      console.error('Error managing role:', error);
    }
  };

  const handleAddContextualRole = async () => {
    if (!selectedRole || !userId) return;
    
    try {
      const roleId = parseInt(selectedRole);
      
      const contextData = {
        coordenacao_id: selectedCoord || undefined,
        supervisao_tecnica_id: selectedSuper || undefined
      };
      
      await addRole(userId, roleId, contextData);
      
      // Reset selections
      setSelectedRole('');
      setSelectedCoord('');
      setSelectedSuper('');
      
      // Refresh user roles
      await fetchUserRoles();
    } catch (error) {
      console.error('Error adding contextual role:', error);
    }
  };

  const handleRemoveContextualRole = async (roleEntry: UserRole) => {
    if (!roleEntry.id || !userId) return;
    
    try {
      const contextData = {
        coordenacao_id: roleEntry.coordenacao_id,
        supervisao_tecnica_id: roleEntry.supervisao_tecnica_id
      };
      
      await removeRole(userId, roleEntry.role_id, contextData);
      
      // Refresh user roles
      await fetchUserRoles();
    } catch (error) {
      console.error('Error removing contextual role:', error);
    }
  };

  const hasGeneralRole = (roleId: number) => {
    return userRoles.some(ur => 
      ur.role_id === roleId && 
      !ur.coordenacao_id && 
      !ur.supervisao_tecnica_id
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permissões Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map(role => (
              <div key={role.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`role-${role.id}`} 
                  checked={hasGeneralRole(role.id)}
                  onCheckedChange={(checked) => handleToggleRole(role, checked === true)}
                  disabled={updating}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={`role-${role.id}`} className="font-medium">
                    {role.descricao}
                  </Label>
                  <p className="text-sm text-gray-500">({role.role_nome})</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contextual Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permissões Contextuais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new contextual permission */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">Adicionar permissão contextual:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role-select">Permissão</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Selecione uma permissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coord-select">Coordenação (opcional)</Label>
                <Select value={selectedCoord} onValueChange={setSelectedCoord}>
                  <SelectTrigger id="coord-select">
                    <SelectValue placeholder="Selecione uma coordenação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {coordenacoes.map(coord => (
                      <SelectItem key={coord.id} value={coord.id}>
                        {coord.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="super-select">Supervisão Técnica (opcional)</Label>
                <Select 
                  value={selectedSuper} 
                  onValueChange={setSelectedSuper}
                  disabled={!selectedCoord || filteredSupervisoes.length === 0}
                >
                  <SelectTrigger id="super-select">
                    <SelectValue placeholder={
                      !selectedCoord 
                        ? "Selecione uma coordenação primeiro" 
                        : filteredSupervisoes.length === 0
                        ? "Nenhuma supervisão disponível"
                        : "Selecione uma supervisão"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {filteredSupervisoes.map(superv => (
                      <SelectItem key={superv.id} value={superv.id}>
                        {superv.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleAddContextualRole}
              disabled={!selectedRole || updating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-fit mt-2"
            >
              {updating ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </div>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Permissão
                </>
              )}
            </Button>
          </div>
          
          {/* List of current contextual permissions */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-4">Permissões contextuais atuais:</h3>
            
            {userRoles.filter(ur => ur.coordenacao_id || ur.supervisao_tecnica_id).length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma permissão contextual atribuída.</p>
            ) : (
              <ul className="space-y-3">
                {userRoles
                  .filter(ur => ur.coordenacao_id || ur.supervisao_tecnica_id)
                  .map(roleEntry => (
                    <li key={roleEntry.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <span className="font-medium">{roleEntry.role?.descricao}</span>
                        <div className="flex gap-2 mt-1">
                          {roleEntry.coordenacao && (
                            <Badge variant="outline" className="text-xs">
                              Coord: {roleEntry.coordenacao.descricao}
                            </Badge>
                          )}
                          {roleEntry.supervisao_tecnica && (
                            <Badge variant="outline" className="text-xs">
                              ST: {roleEntry.supervisao_tecnica.descricao}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveContextualRole(roleEntry)}
                        disabled={updating}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRolesManager;
