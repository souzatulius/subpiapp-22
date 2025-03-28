
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotaStatusValues } from './useNotaStatusValues';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useNotasActions = (refetch: () => Promise<any>) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const { statusValues } = useNotaStatusValues();
  const { user } = useAuth();

  const updateNotaStatus = async (notaId: string, newStatus: string) => {
    setStatusLoading(true);
    try {
      console.log(`Atualizando nota ${notaId} para status: ${newStatus}`);
      console.log('User ID:', user?.id);
      
      // Map frontend status values to valid database status values
      const statusMapping: Record<string, string> = {
        'aprovado': 'aprovada',
        'rejeitado': 'rejeitada',
        'excluido': 'excluida',
        'pendente': 'pendente'
      };
      
      const dbStatus = statusMapping[newStatus] || newStatus;
      
      // Perform a single update with both the status and aprovador_id changes
      const updateData: any = { 
        status: dbStatus,
        atualizado_em: new Date().toISOString()
      };
      
      // Add approver ID for approval/rejection actions
      if (['aprovado', 'rejeitado'].includes(newStatus) && user) {
        updateData.aprovador_id = user.id;
      }
      
      console.log('Update data:', updateData);
      
      // Execute the update with all changes at once
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
      return false;
    } finally {
      setStatusLoading(false);
    }
  };

  const deleteNota = async (notaId: string) => {
    setDeleteLoading(true);
    try {
      const { data: nota, error: notaError } = await supabase
        .from('notas_oficiais')
        .select('demanda_id')
        .eq('id', notaId)
        .single();

      if (notaError) throw notaError;

      if (nota.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ 
            status: 'aguardando_nota'
          })
          .eq('id', nota.demanda_id);

        if (demandaError) throw demandaError;
      }

      // Atualizar status para 'excluida' (feminino)
      return await updateNotaStatus(notaId, 'excluido');
    } catch (error: any) {
      console.error('Erro ao excluir nota:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a nota',
        variant: 'destructive',
      });
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
