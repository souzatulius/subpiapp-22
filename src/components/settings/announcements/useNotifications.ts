
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/common';

export const useNotifications = () => {
  const createNotificationsForRecipients = async (
    titulo: string, 
    destinatariosStr: string,
    users: User[],
    currentUserId?: string
  ) => {
    try {
      if (!currentUserId) return;
      
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
              .in('supervisao_tecnica_id', destinatariosObj.ids);
              
            if (error) throw error;
            recipientIds = data ? data.map(u => u.id) : [];
          } else if (destinatariosObj.type === 'cargos') {
            // Usuários com um cargo específico
            const { data, error } = await supabase
              .from('usuarios')
              .select('id')
              .in('cargo_id', destinatariosObj.ids);
              
            if (error) throw error;
            recipientIds = data ? data.map(u => u.id) : [];
          }
        } catch (e) {
          console.error('Erro ao processar destinatários:', e);
          // Fallback para todos os usuários
          recipientIds = users.map(u => u.id);
        }
      }
      
      // Remover o autor da lista de destinatários
      recipientIds = recipientIds.filter(id => id !== currentUserId);
      
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

  return {
    createNotificationsForRecipients
  };
};
