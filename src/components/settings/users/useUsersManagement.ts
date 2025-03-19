
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { completeEmailWithDomain } from '@/lib/authUtils';
import { format } from 'date-fns';

export interface User {
  id: string;
  nome_completo: string;
  email: string;
  aniversario?: string;
  whatsapp?: string;
  foto_perfil_url?: string;
  cargo_id?: string;
  area_coordenacao_id?: string;
  cargos?: {
    id: string;
    descricao: string;
  };
  areas_coordenacao?: {
    id: string;
    descricao: string;
  };
}

export interface Area {
  id: string;
  descricao: string;
}

export interface Cargo {
  id: string;
  descricao: string;
}

export const useUsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('usuarios')
        .select(`
          id, 
          nome_completo, 
          email, 
          aniversario, 
          whatsapp, 
          foto_perfil_url,
          cargo_id,
          area_coordenacao_id,
          cargos:cargo_id(id, descricao),
          areas_coordenacao:area_coordenacao_id(id, descricao)
        `);
        
      if (usersError) throw usersError;
      
      const { data: areasData, error: areasError } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao');
        
      if (areasError) throw areasError;
      
      const { data: cargosData, error: cargosError } = await supabase
        .from('cargos')
        .select('id, descricao');
        
      if (cargosError) throw cargosError;
      
      setUsers(usersData || []);
      setAreas(areasData || []);
      setCargos(cargosData || []);
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

  const handleInviteUser = async (data: { 
    email: string; 
    nome_completo: string; 
    cargo_id?: string; 
    area_coordenacao_id?: string;
  }) => {
    try {
      const email = completeEmailWithDomain(data.email);
      
      const { error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).substring(2, 12),
        options: {
          data: {
            name: data.nome_completo,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (authError) throw authError;

      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single();
        
      if (userError) throw userError;
      
      if (userData) {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            nome_completo: data.nome_completo,
            cargo_id: data.cargo_id || null,
            area_coordenacao_id: data.area_coordenacao_id || null,
          })
          .eq('id', userData.id);
          
        if (updateError) throw updateError;
      }
      
      toast({
        title: 'Convite enviado',
        description: `Um convite foi enviado para ${email}`,
      });
      
      setIsInviteDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao convidar usuário:', error);
      toast({
        title: 'Erro ao convidar usuário',
        description: error.message || 'Ocorreu um erro ao enviar o convite.',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async (data: { 
    nome_completo: string; 
    email: string;
    cargo_id?: string; 
    area_coordenacao_id?: string;
    whatsapp?: string;
    aniversario?: Date;
  }) => {
    try {
      if (!currentUser) return;
      
      const updateData: any = {
        nome_completo: data.nome_completo,
        cargo_id: data.cargo_id || null,
        area_coordenacao_id: data.area_coordenacao_id || null,
      };
      
      if (data.whatsapp !== undefined) {
        updateData.whatsapp = data.whatsapp || null;
      }
      
      if (data.aniversario) {
        updateData.aniversario = format(data.aniversario, 'yyyy-MM-dd');
      }
      
      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', currentUser.id);
        
      if (error) throw error;
      
      toast({
        title: 'Usuário atualizado',
        description: 'Os dados do usuário foram atualizados com sucesso',
      });
      
      setIsEditDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message || 'Ocorreu um erro ao atualizar os dados do usuário.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!currentUser) return;
      
      const { error } = await supabase.auth.admin.deleteUser(currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi excluído com sucesso',
      });
      
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message || 'Ocorreu um erro ao excluir o usuário.',
        variant: 'destructive',
      });
    }
  };

  const handleSendPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email enviado',
        description: 'Um email de redefinição de senha foi enviado',
      });
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição de senha:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao enviar o email de redefinição de senha.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const searchTerms = filter.toLowerCase();
    return (
      user.nome_completo?.toLowerCase().includes(searchTerms) ||
      user.email?.toLowerCase().includes(searchTerms) ||
      user.cargos?.descricao?.toLowerCase().includes(searchTerms) ||
      user.areas_coordenacao?.descricao?.toLowerCase().includes(searchTerms)
    );
  });

  const handleExportCsv = () => {
    const headers = ['Nome', 'Email', 'Cargo', 'Área de Coordenação', 'WhatsApp', 'Aniversário'];
    const csvData = filteredUsers.map(user => [
      user.nome_completo,
      user.email,
      user.cargos?.descricao || '',
      user.areas_coordenacao?.descricao || '',
      user.whatsapp || '',
      user.aniversario ? format(new Date(user.aniversario), 'dd/MM/yyyy') : ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => {
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usuarios.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    users,
    areas,
    cargos,
    loading,
    filter,
    setFilter,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentUser,
    filteredUsers,
    handleInviteUser,
    handleEditUser,
    handleDeleteUser,
    handleSendPasswordReset,
    openEditDialog,
    openDeleteDialog,
    handleExportCsv,
    handlePrint,
  };
};
