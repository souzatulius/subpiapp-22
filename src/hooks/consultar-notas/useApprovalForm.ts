
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { NotaOficial } from '@/types/nota';
import { useNotasActions } from './useNotasActions';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useApprovalForm = (refetch: () => Promise<any>) => {
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');
  
  const { user } = useAuth();
  const { updateNotaStatus, statusLoading } = useNotasActions(refetch);

  const handleSelectNota = (nota: NotaOficial) => {
    setSelectedNota(nota);
    setEditedTitle(nota.titulo);
    setEditedText(nota.texto);
    setEditMode(false);
  };

  const handleBackToList = () => {
    setSelectedNota(null);
    setEditMode(false);
  };

  const handleEditMode = () => {
    if (!selectedNota) return;
    setEditedTitle(selectedNota.titulo);
    setEditedText(selectedNota.texto);
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedNota || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error: historyError } = await supabase
        .from('notas_historico_edicoes')
        .insert({
          nota_id: selectedNota.id,
          editor_id: user.id,
          texto_anterior: selectedNota.texto,
          texto_novo: editedText,
          titulo_anterior: selectedNota.titulo,
          titulo_novo: editedTitle
        });
      
      if (historyError) throw historyError;
      
      const { error: updateError } = await supabase
        .from('notas_oficiais')
        .update({
          titulo: editedTitle,
          texto: editedText,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Nota atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
      
      await refetch();
      setEditMode(false);
      
      if (selectedNota) {
        setSelectedNota(prevNota => ({
          ...prevNota,
          titulo: editedTitle,
          texto: editedText,
          atualizado_em: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Erro ao salvar edições:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAprovarNota = async () => {
    if (!selectedNota || !user) {
      console.error("Não é possível aprovar: usuário não autenticado ou nota não selecionada");
      toast({
        title: "Erro ao aprovar",
        description: "Usuário não autenticado ou nota não selecionada.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Aprovando nota:", selectedNota.id, "por usuário:", user.id);
      const result = await updateNotaStatus(selectedNota.id, 'aprovado');
      
      if (result) {
        setSelectedNota(null);
      }
    } catch (error) {
      console.error('Erro ao aprovar nota:', error);
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar a nota oficial.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejeitarNota = async () => {
    if (!selectedNota || !user) {
      console.error("Não é possível rejeitar: usuário não autenticado ou nota não selecionada");
      toast({
        title: "Erro ao rejeitar",
        description: "Usuário não autenticado ou nota não selecionada.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Rejeitando nota:", selectedNota.id, "por usuário:", user.id);
      const result = await updateNotaStatus(selectedNota.id, 'rejeitado');
      
      if (result) {
        setSelectedNota(null);
      }
    } catch (error) {
      console.error('Erro ao rejeitar nota:', error);
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar a nota oficial.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedNota,
    isSubmitting,
    editMode,
    editedTitle,
    editedText,
    statusLoading,
    handleSelectNota,
    handleBackToList,
    handleEditMode,
    handleSaveEdit,
    handleAprovarNota,
    handleRejeitarNota,
    setEditedTitle,
    setEditedText,
    setEditMode
  };
};
