
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotaStatusValues } from './useNotaStatusValues';

export const useNotasActions = (refetch: () => Promise<any>) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const { statusValues } = useNotaStatusValues();

  const updateNotaStatus = async (notaId: string, newStatus: string) => {
    setStatusLoading(true);
    try {
      console.log(`Atualizando nota ${notaId} para status: ${newStatus}`);
      
      // Map frontend status values to valid database status values
      const statusMapping: Record<string, string> = {
        'aprovado': 'aprovada',
        'rejeitado': 'rejeitada',
        'excluido': 'excluida',
        'pendente': 'pendente'
      };
      
      const dbStatus = statusMapping[newStatus] || newStatus;
      
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ 
          status: dbStatus,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', notaId);

      if (error) throw error;

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
