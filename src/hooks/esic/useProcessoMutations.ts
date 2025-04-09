
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';
import { v4 as uuidv4 } from 'uuid';

type MutationOptions = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const useProcessoMutations = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProcesso = async (
    formValues: ESICProcessoFormValues, 
    options?: MutationOptions
  ) => {
    setIsCreating(true);
    setError(null);

    try {
      // Generate a unique protocol number
      const protocolo = `ESIC-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Get user information from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Prepare data for Supabase
      const processoData = {
        protocolo,
        assunto: formValues.assunto,
        solicitante: formValues.solicitante,
        data_processo: formValues.data_processo instanceof Date 
          ? formValues.data_processo.toISOString().split('T')[0] 
          : formValues.data_processo,
        autor_id: user.id,
        texto: formValues.texto,
        situacao: formValues.situacao,
        status: 'novo_processo' as ESICProcesso['status'],
        coordenacao_id: formValues.coordenacao_id === 'none' ? null : formValues.coordenacao_id,
        prazo_resposta: formValues.prazo_resposta instanceof Date 
          ? formValues.prazo_resposta.toISOString().split('T')[0]
          : formValues.prazo_resposta,
      };

      // Insert into Supabase
      const result = await supabase
        .from('esic_processos')
        .insert(processoData)
        .select();

      if (result.error) {
        console.error('Erro ao criar processo:', result.error);
        throw result.error;
      }
      
      options?.onSuccess?.();
      
      toast({
        title: 'Processo criado com sucesso',
        description: `O processo ${protocolo} foi criado com sucesso.`,
      });
      
      return result.data[0];
    } catch (err: any) {
      setError(err.message);
      options?.onError?.(err);
      toast({
        title: 'Erro ao criar processo',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const updateProcesso = async (
    params: { id: string; data: any }, 
    options?: MutationOptions
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      // Ensure status is a valid enum value if it's being updated
      if (params.data.status) {
        const validStatuses = [
          'novo_processo', 
          'aberto', 
          'em_andamento', 
          'concluido', 
          'cancelado', 
          'aguardando_justificativa', 
          'aguardando_aprovacao'
        ];
        
        if (!validStatuses.includes(params.data.status)) {
          params.data.status = 'novo_processo';
        }
      }

      const result = await supabase
        .from('esic_processos')
        .update(params.data)
        .eq('id', params.id)
        .select();

      if (result.error) {
        throw result.error;
      }

      options?.onSuccess?.();
      
      return result.data?.[0];
    } catch (err: any) {
      setError(err.message);
      options?.onError?.(err);
      toast({
        title: 'Erro ao atualizar processo',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProcesso = async (
    id: string,
    options?: MutationOptions
  ) => {
    setIsDeleting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('esic_processos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      
      options?.onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      options?.onError?.(err);
      toast({
        title: 'Erro ao excluir processo',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createProcesso,
    updateProcesso,
    deleteProcesso,
    isCreating,
    isUpdating,
    isDeleting,
    error
  };
};
