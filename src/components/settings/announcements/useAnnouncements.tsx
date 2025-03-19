
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema for announcement validation
export const announcementSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  mensagem: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
  destinatarios: z.string().min(1, 'Informe os destinatários'),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
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
    },
  });

  useEffect(() => {
    fetchAnnouncements();
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
      
      // Notificar usuários - em um sistema real, isso poderia enviar emails ou notificações push
      try {
        await supabase
          .from('notificacoes')
          .insert({
            mensagem: `Novo comunicado: ${data.titulo}`,
            usuario_id: user.id, // No sistema real, isso seria para cada destinatário
            data: new Date().toISOString(),
            lida: false,
          });
      } catch (notifyError) {
        console.error('Erro ao criar notificação:', notifyError);
      }
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
      announcement.destinatarios,
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
  };
};
