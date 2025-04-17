
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demand, ResponseQA } from './types';

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
      console.log("Fetching response for demand:", demandaId);
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select('*')
        .eq('demanda_id', demandaId)
        .limit(1);
      
      if (error) {
        console.error("Error fetching response:", error);
        throw error;
      }
      
      console.log("Response data:", data);
      
      if (data && data.length > 0) {
        setDemandaResponse(data[0].texto);
        // If there are comments available, update the selected demanda with them
        if (data[0].comentarios) {
          setSelectedDemanda(prev => prev ? {
            ...prev,
            comentarios: data[0].comentarios
          } : null);
        }
      } else {
        console.log("No response found for demand", demandaId);
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
    console.log("Selected demand ID:", demandaId);
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      console.log("Found selected demand:", selected);
      setSelectedDemanda(selected);
      // Set a default title based on the demand title
      setTitulo(selected.titulo || '');
      // Fetch responses for this demand
      fetchDemandResponse(demandaId);
    } else {
      console.error("Could not find selected demand with ID", demandaId);
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

    if (!selectedDemanda) {
      toast({
        title: "Demanda inválida",
        description: "Selecione uma demanda válida.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting nota for demand:", selectedDemandaId);
      
      // Buscar o ID do problema associado à área da demanda
      const problemaId = selectedDemanda.problema_id || null;
      
      if (!problemaId) {
        console.log("No problema_id found, will try to create or find a default one");
      }
      
      let finalProblemaId = problemaId;
      
      if (!finalProblemaId) {
        // Try to find a default problema or create one
        const { data: problemaData, error: problemaError } = await supabase
          .from('problemas')
          .select('id')
          .limit(1);
        
        if (problemaError) {
          console.error("Error fetching problema:", problemaError);
          throw problemaError;
        }
        
        if (!problemaData || problemaData.length === 0) {
          // Create a default problema
          const coordenacaoId = selectedDemanda.coordenacao_id || null;
          
          console.log("Creating default problema with coordenacao_id:", coordenacaoId);
          
          const { data: newProblema, error: newProblemaError } = await supabase
            .from('problemas')
            .insert({ 
              descricao: 'Problema Padrão',
              coordenacao_id: coordenacaoId 
            })
            .select();
            
          if (newProblemaError) {
            console.error("Error creating default problema:", newProblemaError);
            throw newProblemaError;
          }
          
          finalProblemaId = newProblema[0].id;
          console.log("Created default problema with id:", finalProblemaId);
        } else {
          finalProblemaId = problemaData[0].id;
          console.log("Using existing problema with id:", finalProblemaId);
        }
      }
      
      console.log("Creating nota with problema_id:", finalProblemaId);
      
      // Create the note with existing problema
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert({
          titulo,
          texto,
          coordenacao_id: selectedDemanda.coordenacao_id || null,
          autor_id: user?.id,
          status: 'pendente',
          demanda_id: selectedDemandaId,
          problema_id: finalProblemaId
        })
        .select();
      
      if (error) {
        console.error("Error creating nota:", error);
        throw error;
      }
      
      console.log("Nota created successfully:", data);
      
      // Update the demand status to reflect that a note has been created
      const { error: updateError } = await supabase
        .from('demandas')
        .update({ status: 'aguardando_aprovacao' })
        .eq('id', selectedDemandaId);
        
      if (updateError) {
        console.error('Error updating demand status:', updateError);
        // Don't throw here, we still want to show success for the note creation
      } else {
        console.log("Demand status updated to 'aguardando_aprovacao'");
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
