
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demand, ResponseQA } from '../types';

export const useNotaForm = (onClose: () => void) => {
  const { user } = useAuth();
  const [selectedDemandaId, setSelectedDemandaId] = useState('');
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
  const [demandaResponse, setDemandaResponse] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-note'>('select-demand');

  const fetchDemandResponse = async (demandaId: string) => {
    try {
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select('*')
        .eq('demanda_id', demandaId)
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setDemandaResponse(data[0].texto);
      } else {
        setDemandaResponse(null);
      }
    } catch (error) {
      console.error('Erro ao carregar respostas da demanda:', error);
      toast({
        title: "Erro ao carregar respostas",
        description: "Não foi possível carregar as respostas da demanda.",
        variant: "destructive"
      });
    }
  };

  const handleDemandaSelect = (demandaId: string, demandas: Demand[]) => {
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      setSelectedDemanda(selected);
      // Fetch responses for this demand
      fetchDemandResponse(demandaId);
    }
    
    setStep('create-note');
  };

  const handleBackToSelection = () => {
    setStep('select-demand');
    setSelectedDemanda(null);
    setDemandaResponse(null);
  };

  const handleSubmit = async () => {
    // Validação
    if (!titulo.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a nota oficial.",
        variant: "destructive"
      });
      return;
    }

    if (!texto.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, informe o conteúdo da nota oficial.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDemanda || !selectedDemanda.problema_id) {
      toast({
        title: "Demanda inválida",
        description: "A demanda selecionada não possui problema associado.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create the note with problema_id instead of area_coordenacao_id
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert({
          titulo,
          texto,
          problema_id: selectedDemanda.problema_id,
          autor_id: user?.id,
          status: 'pendente',
          demanda_id: selectedDemandaId
        })
        .select();
      
      if (error) throw error;
      
      // Update the demand status to reflect that a note has been created
      const { error: updateError } = await supabase
        .from('demandas')
        .update({ status: 'respondida' })
        .eq('id', selectedDemandaId);
        
      if (updateError) {
        console.error('Error updating demand status:', updateError);
        // Don't throw here, we still want to show success for the note creation
      }
      
      toast({
        title: "Nota oficial criada com sucesso!",
        description: "A nota foi enviada para aprovação.",
      });
      
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar nota oficial:', error);
      toast({
        title: "Erro ao criar nota oficial",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format the responses text
  const formatResponses = (responseText: string | null): ResponseQA[] => {
    if (!responseText) return [];
    
    // Split by double newlines to get question-answer pairs
    const pairs = responseText.split('\n\n');
    return pairs.map(pair => {
      const lines = pair.split('\n');
      if (lines.length >= 2) {
        // Extract question and answer
        const question = lines[0].replace('Pergunta: ', '');
        const answer = lines[1].replace('Resposta: ', '');
        return { question, answer };
      }
      return { question: '', answer: '' };
    }).filter(qa => qa.question && qa.answer);
  };

  const formattedResponses = formatResponses(demandaResponse);

  return {
    selectedDemandaId,
    selectedDemanda,
    titulo,
    setTitulo,
    texto,
    setTexto,
    isSubmitting,
    step,
    formattedResponses,
    handleDemandaSelect,
    handleBackToSelection,
    handleSubmit
  };
};
