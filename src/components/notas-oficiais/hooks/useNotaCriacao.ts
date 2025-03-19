
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demanda } from '../types';

export function useNotaCriacao(demandaId: string, demanda: Demanda | undefined, onClose: () => void) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const queryClient = useQueryClient();
  
  const criarNotaMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!demanda?.area_coordenacao?.id) {
        throw new Error('Dados insuficientes para criar a nota oficial');
      }
      
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert([{
          titulo,
          texto,
          autor_id: userId,
          area_coordenacao_id: demanda.area_coordenacao.id,
          demanda_id: demandaId,
          status: 'pendente'
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Nota oficial criada',
        description: 'A nota oficial foi criada com sucesso e está aguardando aprovação.',
      });
      queryClient.invalidateQueries({ queryKey: ['nota-oficial-existente', demandaId] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar nota',
        description: `Ocorreu um erro: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  const handleSubmit = (userId: string) => {
    if (!titulo.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, informe um título para a nota oficial.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!texto.trim()) {
      toast({
        title: 'Conteúdo obrigatório',
        description: 'Por favor, informe o conteúdo da nota oficial.',
        variant: 'destructive',
      });
      return;
    }
    
    criarNotaMutation.mutate(userId);
  };
  
  return {
    titulo,
    setTitulo,
    texto,
    setTexto,
    handleSubmit,
    isPending: criarNotaMutation.isPending
  };
}
