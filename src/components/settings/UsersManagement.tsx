
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Mail, 
  Plus, 
  Trash, 
  UserPlus, 
  Edit, 
  Download, 
  Search,
  Printer
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { completeEmailWithDomain } from '@/lib/authUtils';

const inviteUserSchema = z.object({
  email: z.string().email('Email inválido'),
  nome_completo: z.string().min(3, 'Nome completo é obrigatório'),
  cargo_id: z.string().optional(),
  area_coordenacao_id: z.string().optional(),
});

const UsersManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [cargos, setCargos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState('');
  
  const inviteForm = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      nome_completo: '',
      cargo_id: undefined,
      area_coordenacao_id: undefined,
    },
  });

  const editForm = useForm({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      nome_completo: '',
      cargo_id: undefined,
      area_coordenacao_id: undefined,
    },
  });

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
        
        // Fetch areas
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao');
          
        if (areasError) throw areasError;
        
        // Fetch cargos
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
    
    fetchData();
  }, []);

  const handleInviteUser = async (data: z.infer<typeof inviteUserSchema>) => {
    try {
      const email = completeEmailWithDomain(data.email);
      
      // Create user in Supabase Auth
      const { error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).substring(2, 12), // Random password that will be reset
        options: {
          data: {
            name: data.nome_completo,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (authError) throw authError;

      // Update user data in the usuarios table
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
      
      // Reset form and close dialog
      inviteForm.reset();
      setIsInviteDialogOpen(false);
      
      // Refresh user list
      const { data: updatedUsers } = await supabase
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
        
      if (updatedUsers) {
        setUsers(updatedUsers);
      }
    } catch (error: any) {
      console.error('Erro ao convidar usuário:', error);
      toast({
        title: 'Erro ao convidar usuário',
        description: error.message || 'Ocorreu um erro ao enviar o convite.',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async (data: any) => {
    try {
      if (!currentUser) return;
      
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_completo: data.nome_completo,
          cargo_id: data.cargo_id || null,
          area_coordenacao_id: data.area_coordenacao_id || null,
        })
        .eq('id', currentUser.id);
        
      if (error) throw error;
      
      toast({
        title: 'Usuário atualizado',
        description: 'Os dados do usuário foram atualizados com sucesso',
      });
      
      // Reset form and close dialog
      editForm.reset();
      setIsEditDialogOpen(false);
      
      // Refresh user list
      const { data: updatedUsers } = await supabase
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
        
      if (updatedUsers) {
        setUsers(updatedUsers);
      }
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
      
      // Delete the user from auth.users (this will also delete from usuarios due to cascade)
      const { error } = await supabase.auth.admin.deleteUser(currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi excluído com sucesso',
      });
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      
      // Refresh user list
      const { data: updatedUsers } = await supabase
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
        
      if (updatedUsers) {
        setUsers(updatedUsers);
      }
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

  const openEditDialog = (user: any) => {
    setCurrentUser(user);
    editForm.reset({
      email: user.email,
      nome_completo: user.nome_completo,
      cargo_id: user.cargo_id || undefined,
      area_coordenacao_id: user.area_coordenacao_id || undefined,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: any) => {
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
    // Create CSV data
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
    link.download = 'usuarios.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        
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
            
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Convidar Usuário
            </Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Área de Coordenação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]" />
                  <p className="mt-2">Carregando usuários...</p>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {filter ? 'Nenhum usuário encontrado para a busca' : 'Nenhum usuário cadastrado'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.foto_perfil_url} alt={user.nome_completo} />
                        <AvatarFallback>{user.nome_completo.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.nome_completo}</p>
                        <p className="text-xs text-gray-500">
                          {user.aniversario 
                            ? format(new Date(user.aniversario), 'dd/MM/yyyy', { locale: pt }) 
                            : 'Sem data de aniversário'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cargos?.descricao || '-'}</TableCell>
                  <TableCell>{user.areas_coordenacao?.descricao || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleSendPasswordReset(user.email)}
                        title="Enviar email de redefinição de senha"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => openEditDialog(user)}
                        title="Editar usuário"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => openDeleteDialog(user)}
                        title="Excluir usuário"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Invite user dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Novo Usuário</DialogTitle>
            <DialogDescription>
              Envie um convite para um novo usuário se juntar à plataforma.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...inviteForm}>
            <form onSubmit={inviteForm.handleSubmit(handleInviteUser)} className="space-y-4">
              <FormField
                control={inviteForm.control}
                name="nome_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={inviteForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@smsub.prefeitura.sp.gov.br" 
                        type="email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={inviteForm.control}
                name="cargo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cargos.map((cargo) => (
                          <SelectItem key={cargo.id} value={cargo.id}>
                            {cargo.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={inviteForm.control}
                name="area_coordenacao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de Coordenação</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convidar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit user dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="nome_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@smsub.prefeitura.sp.gov.br" 
                        type="email" 
                        {...field} 
                        disabled 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="cargo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cargos.map((cargo) => (
                          <SelectItem key={cargo.id} value={cargo.id}>
                            {cargo.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="area_coordenacao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de Coordenação</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete user confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="p-4 bg-gray-50 rounded-md">
              <p><strong>Nome:</strong> {currentUser.nome_completo}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
