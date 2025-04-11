
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotaStatusValues } from './useNotaStatusValues';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const useNotasActions = (refetch: () => Promise<any>) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const { statusValues } = useNotaStatusValues();
  const { user, session } = useAuth();
  const { showFeedback } = useAnimatedFeedback();

  const updateNotaStatus = async (notaId: string, newStatus: string) => {
    setStatusLoading(true);
    try {
      // Verify user authentication
      if (!user || !session) {
        console.error("Usuário não autenticado ao tentar atualizar nota:", notaId);
        throw new Error("Usuário não autenticado");
      }
      
      console.log(`Atualizando nota ${notaId} para status: ${newStatus}`);
      console.log('User ID:', user.id);
      console.log('Session:', session ? 'Valid' : 'Invalid');
      
      // Map frontend status values to valid database status values
      const statusMapping: Record<string, string> = {
        'aprovado': 'aprovada',
        'rejeitado': 'rejeitada',
        'excluido': 'excluida',
        'pendente': 'pendente'
      };
      
      const dbStatus = statusMapping[newStatus] || newStatus;
      
      // Prepare update data with all necessary fields
      const updateData: any = { 
        status: dbStatus,
        atualizado_em: new Date().toISOString()
      };
      
      // Add approver ID for approval/rejection actions
      if (['aprovado', 'rejeitado'].includes(newStatus) && user) {
        updateData.aprovador_id = user.id;
      }
      
      console.log('Update data:', updateData);
      
      // Make sure we're using the authenticated client
      const { error } = await supabase
        .from('notas_oficiais')
        .update(updateData)
        .eq('id', notaId);

      if (error) {
        console.error('Erro detalhado na atualização:', error);
        throw error;
      }

      const statusDescriptions: Record<string, string> = {
        'aprovada': 'aprovada',
        'rejeitada': 'rejeitada',
        'excluida': 'excluída',
        'pendente': 'marcada como pendente'
      };

      toast({
        title: `Nota ${statusDescriptions[dbStatus] || dbStatus}`,
        description: `A nota foi ${statusDescriptions[dbStatus] || dbStatus} com sucesso.`,
        variant: 'default',
      });
      
      // Show animated feedback
      if (dbStatus === 'aprovada') {
        showFeedback('success', 'Nota aprovada com sucesso!');
      } else if (dbStatus === 'rejeitada') {
        showFeedback('error', 'Nota rejeitada');
      }
      
      // Atualizar lista de notas
      await refetch();
      
      return true;
    } catch (error: any) {
      console.error(`Erro ao atualizar status da nota para ${newStatus}:`, error);
      toast({
        title: 'Erro',
        description: `Não foi possível atualizar a nota: ${error.message || 'Erro desconhecido'}`,
        variant: 'destructive',
      });
      
      // Show error feedback
      showFeedback('error', 'Falha ao atualizar nota');
      
      return false;
    } finally {
      setStatusLoading(false);
    }
  };

  const deleteNota = async (notaId: string) => {
    setDeleteLoading(true);
    try {
      // Verify user authentication
      if (!user || !session) {
        console.error("Usuário não autenticado ao tentar excluir nota:", notaId);
        throw new Error("Usuário não autenticado");
      }
      
      const { data: nota, error: notaError } = await supabase
        .from('notas_oficiais')
        .select('demanda_id')
        .eq('id', notaId)
        .single();

      if (notaError) throw notaError;

      // If nota is linked to a demand, update the demand status to allow creating new notes
      if (nota.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ 
            status: 'aguardando_nota'
          })
          .eq('id', nota.demanda_id);

        if (demandaError) throw demandaError;
      }

      // Actually DELETE the note (not just update status)
      const { error: deleteError } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('id', notaId);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: 'Nota excluída com sucesso',
        description: 'A nota foi permanentemente removida do sistema.',
      });
      
      // Show animated feedback for successful deletion
      showFeedback('success', 'Nota excluída com sucesso');
      
      await refetch();
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir nota:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a nota',
        variant: 'destructive',
      });
      
      // Show error feedback
      showFeedback('error', 'Falha ao excluir nota');
      
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    deleteNota,
    deleteLoading,
    updateNotaStatus,
    statusLoading
  };
};
