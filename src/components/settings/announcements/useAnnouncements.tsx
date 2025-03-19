
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema para validação de comunicados
export const announcementSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  mensagem: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
  destinatarios: z.string().min(1, 'Informe os destinatários'),
  area_id: z.string().optional(),
  cargo_id: z.string().optional(),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export interface User {
  id: string;
  nome_completo: string;
  email: string;
}

export interface Area {
  id: string;
  descricao: string;
}

export interface Cargo {
  id: string;
  descricao: string;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const { user } = useAuth();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      titulo: '',
      mensagem: '',
      destinatarios: 'Todos',
      area_id: '',
      cargo_id: '',
    },
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchUsers();
    fetchAreas();
    fetchCargos();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comunicados')
        .select(`
          *,
          autor:autor_id(id, nome_completo, email)
        `)
        .order('data_envio', { ascending: false });
      
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar comunicados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os comunicados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao');
      
      if (error) throw error;
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar áreas:', error);
    }
  };

  const fetchCargos = async () => {
    try {
      const { data, error } = await supabase
        .from('cargos')
        .select('id, descricao');
      
      if (error) throw error;
      setCargos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar cargos:', error);
    }
  };

  const handleCreateAnnouncement = async (data: AnnouncementFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comunicados')
        .insert({
          titulo: data.titulo,
          mensagem: data.mensagem,
          destinatarios: data.destinatarios,
          autor_id: user.id,
          data_envio: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: 'Comunicado enviado',
        description: 'O comunicado foi enviado com sucesso',
      });
      
      form.reset();
      setIsCreateDialogOpen(false);
      await fetchAnnouncements();
      
      // Criar notificações para os destinatários
      await createNotificationsForRecipients(data.titulo, data.destinatarios);
      
    } catch (error: any) {
      console.error('Erro ao criar comunicado:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao enviar o comunicado',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createNotificationsForRecipients = async (titulo: string, destinatariosStr: string) => {
    try {
      if (!user) return;
      
      let recipientIds: string[] = [];
      
      if (destinatariosStr === 'Todos') {
        // Todos os usuários
        recipientIds = users.map(u => u.id);
      } else {
        try {
          const destinatariosObj = JSON.parse(destinatariosStr);
          
          if (destinatariosObj.type === 'usuarios') {
            // Usuários específicos
            recipientIds = destinatariosObj.ids;
          } else if (destinatariosObj.type === 'areas') {
            // Usuários de uma área específica
            const { data, error } = await supabase
              .from('usuarios')
              .select('id')
              .in('area_coordenacao_id', destinatariosObj.ids);
              
            if (error) throw error;
            recipientIds = data.map(u => u.id);
          } else if (destinatariosObj.type === 'cargos') {
            // Usuários com um cargo específico
            const { data, error } = await supabase
              .from('usuarios')
              .select('id')
              .in('cargo_id', destinatariosObj.ids);
              
            if (error) throw error;
            recipientIds = data.map(u => u.id);
          }
        } catch (e) {
          console.error('Erro ao processar destinatários:', e);
          // Fallback para todos os usuários
          recipientIds = users.map(u => u.id);
        }
      }
      
      // Remover o autor da lista de destinatários
      recipientIds = recipientIds.filter(id => id !== user.id);
      
      if (recipientIds.length === 0) return;
      
      // Criar notificações para cada destinatário
      const notifications = recipientIds.map(usuarioId => ({
        mensagem: `Novo comunicado: ${titulo}`,
        usuario_id: usuarioId,
        data_envio: new Date().toISOString(),
        lida: false,
      }));
      
      // Inserir notificações
      const { error } = await supabase
        .from('notificacoes')
        .insert(notifications);
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Erro ao criar notificações:', error);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!currentAnnouncement) return;
    
    try {
      const { error } = await supabase
        .from('comunicados')
        .delete()
        .eq('id', currentAnnouncement.id);
      
      if (error) throw error;
      
      toast({
        title: 'Comunicado excluído',
        description: 'O comunicado foi excluído com sucesso',
      });
      
      setIsDeleteDialogOpen(false);
      setCurrentAnnouncement(null);
      await fetchAnnouncements();
    } catch (error: any) {
      console.error('Erro ao excluir comunicado:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o comunicado',
        variant: 'destructive',
      });
    }
  };

  const handleExportCsv = () => {
    // Create CSV data
    const headers = ['Título', 'Mensagem', 'Destinatários', 'Autor', 'Data de Envio'];
    const csvData = filteredAnnouncements.map(announcement => [
      announcement.titulo,
      announcement.mensagem.replace(/\n/g, ' '),
      formatDestination(announcement.destinatarios),
      announcement.autor?.nome_completo || '',
      new Date(announcement.data_envio).toLocaleString('pt-BR')
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
    link.download = 'comunicados.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const formatDestination = (destinatariosStr: string): string => {
    if (destinatariosStr === 'Todos') {
      return 'Todos os usuários';
    }
    
    try {
      const destinatariosObj = JSON.parse(destinatariosStr);
      
      if (destinatariosObj.type === 'usuarios') {
        const count = destinatariosObj.ids.length;
        if (count === 1) {
          const user = users.find(u => u.id === destinatariosObj.ids[0]);
          return user ? `Usuário: ${user.nome_completo}` : 'Um usuário específico';
        }
        return `${count} usuários específicos`;
      } else if (destinatariosObj.type === 'areas') {
        const area = areas.find(a => a.id === destinatariosObj.ids[0]);
        return area ? `Área: ${area.descricao}` : 'Uma área específica';
      } else if (destinatariosObj.type === 'cargos') {
        const cargo = cargos.find(c => c.id === destinatariosObj.ids[0]);
        return cargo ? `Cargo: ${cargo.descricao}` : 'Um cargo específico';
      }
      
      return 'Destinatários específicos';
    } catch (e) {
      return destinatariosStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const searchTerms = filter.toLowerCase();
    return (
      announcement.titulo?.toLowerCase().includes(searchTerms) ||
      announcement.mensagem?.toLowerCase().includes(searchTerms) ||
      announcement.destinatarios?.toLowerCase().includes(searchTerms) ||
      announcement.autor?.nome_completo?.toLowerCase().includes(searchTerms)
    );
  });

  return {
    announcements,
    users,
    areas,
    cargos,
    loading,
    isSubmitting,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentAnnouncement,
    setCurrentAnnouncement,
    filter,
    setFilter,
    form,
    handleCreateAnnouncement,
    handleDeleteAnnouncement,
    handleExportCsv,
    handlePrint,
    filteredAnnouncements,
    formatDestination,
  };
};
