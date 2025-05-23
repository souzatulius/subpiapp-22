
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

export const positionSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

export type Position = {
  id: string;
  descricao: string;
  criado_em: string;
};

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cargos')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setPositions(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar cargos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os cargos',
        variant: 'destructive',
      });
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const addPosition = async (data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Adicionando cargo:', data);
      
      // Retorna o ID gerado pelo RPC corretamente
      const { data: newId, error } = await supabase.rpc('insert_cargo', {
        p_descricao: data.descricao
      });
      
      if (error) throw error;
      
      console.log('Cargo adicionado com sucesso:', newId);
      
      toast({
        title: 'Sucesso',
        description: 'Cargo adicionado com sucesso',
      });
      
      await fetchPositions();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar cargo:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o cargo',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePosition = async (id: string, data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Editando cargo:', id, data);
      
      const { data: result, error } = await supabase.rpc('update_cargo', {
        p_id: id,
        p_descricao: data.descricao
      });
      
      if (error) throw error;
      
      console.log('Cargo atualizado com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Cargo atualizado com sucesso',
      });
      
      await fetchPositions();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar cargo:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o cargo',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePosition = async (position: Position) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('cargo_id', position.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem usuários associados a este cargo',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Excluindo cargo:', position.id);
      
      const { error } = await supabase.rpc('delete_cargo', {
        p_id: position.id
      });
      
      if (error) throw error;
      
      toast({
        title: 'Cargo excluído',
        description: 'O cargo foi excluído com sucesso',
      });
      
      await fetchPositions();
    } catch (error: any) {
      console.error('Erro ao excluir cargo:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o cargo',
        variant: 'destructive',
      });
    }
  };

  return {
    positions,
    loading,
    isSubmitting,
    addPosition,
    updatePosition,
    deletePosition
  };
}
