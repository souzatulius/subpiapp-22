
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { announcementSchema, AnnouncementFormValues, Announcement } from './types';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useAnnouncementForm = (
  fetchAnnouncements: () => Promise<void>,
  createNotifications: (titulo: string, destinatarios: string, users: any[], userId?: string) => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  
  const { user } = useAuth();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      titulo: '',
      mensagem: '',
      destinatarios: 'Todos',
      area_id: undefined,
      cargo_id: undefined,
    },
  });

  const handleCreateAnnouncement = async (data: AnnouncementFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Inserir comunicado no banco de dados
      const { error } = await supabase.from('comunicados').insert({
        titulo: data.titulo,
        mensagem: data.mensagem,
        destinatarios: data.destinatarios,
        data_envio: new Date().toISOString(),
        autor_id: user?.id,
      });
      
      if (error) throw error;
      
      // Criar notificações para os destinatários
      if (user?.id) {
        await createNotifications(
          data.titulo,
          data.destinatarios,
          [], // This should be the users list, will be passed from the parent component
          user.id
        );
      }
      
      // Resetar formulário e fechar dialog
      form.reset();
      setIsCreateDialogOpen(false);
      
      // Atualizar lista de comunicados
      await fetchAnnouncements();
      
      toast({
        title: 'Comunicado enviado',
        description: 'O comunicado foi enviado com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao criar comunicado:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o comunicado.',
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
      
      setCurrentAnnouncement(null);
      setIsDeleteDialogOpen(false);
      
      await fetchAnnouncements();
      
      toast({
        title: 'Comunicado excluído',
        description: 'O comunicado foi excluído com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao excluir comunicado:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o comunicado.',
        variant: 'destructive',
      });
    }
  };

  return {
    isSubmitting,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentAnnouncement,
    setCurrentAnnouncement: (announcement: Announcement) => setCurrentAnnouncement(announcement),
    form,
    handleCreateAnnouncement,
    handleDeleteAnnouncement,
  };
};
