
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demand, ResponseQA } from '@/components/dashboard/forms/criar-nota/types';
import { useNavigate } from 'react-router-dom';
import { formatResponses } from './utils/formatResponses';

export const useNotaForm = (onClose: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDemandaId, setSelectedDemandaId] = useState('');
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
  const [demandaResponse, setDemandaResponse] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-note'>('select-demand');

  const fetchDemandResponse = async (demandaId: string) => {
    if (!demandaId) {
      console.error('Missing demandaId in fetchDemandResponse');
      return;
    }
    
    try {
      console.log('Fetching response for demanda:', demandaId);
      
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select('texto, comentarios, respostas')
        .eq('demanda_id', demandaId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching response:', error);
        throw error;
      }
      
      console.log('Response data:', data);
      
      if (data) {
        // Store comentarios separately
        setComentarios(data.comentarios || null);
        
        // Process the response text
        setDemandaResponse(data.texto || null);
        
        // If we have a structured respostas object, convert it to text
        if (data.respostas && typeof data.respostas === 'object') {
          try {
            let respostasText = '';
            Object.entries(data.respostas).forEach(([key, value]) => {
              const questionText = selectedDemanda?.perguntas?.[key] || `Pergunta ${Number(key) + 1}`;
              respostasText += `Pergunta: ${questionText}\nResposta: ${value}\n\n`;
            });
            setDemandaResponse(prev => prev || respostasText);
          } catch (parseError) {
            console.error('Error parsing respostas:', parseError);
          }
        }
      } else {
        setDemandaResponse(null);
        setComentarios(null);
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

  const handleDemandaSelect = async (demandaId: string, demandas: Demand[]) => {
    if (!demandaId || !demandas || !demandas.length) {
      console.error('Invalid parameters in handleDemandaSelect', { demandaId, demandasLength: demandas?.length });
      return;
    }
    
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      console.log("Selected demand:", selected);
      setSelectedDemanda(selected);
      
      // Set a default title based on the demand title
      setTitulo(selected.titulo || '');
      
      // If the demand has response data, use it directly
      if (selected.resposta?.texto) {
        console.log("Using response text from selected demand:", selected.resposta.texto.substring(0, 100));
        setDemandaResponse(selected.resposta.texto);
        setComentarios(selected.comentarios || null);
      } else {
        // Otherwise fetch responses for this demand
        await fetchDemandResponse(demandaId);
      }
    } else {
      console.error('Selected demand not found in demandas array');
      toast({
        title: "Erro",
        description: "Demanda selecionada não encontrada. Por favor, tente novamente.",
        variant: "destructive"
      });
      return;
    }
    
    setStep('create-note');
  };

  const handleBackToSelection = () => {
    setStep('select-demand');
    setSelectedDemanda(null);
    setDemandaResponse(null);
    setComentarios(null);
    setTitulo('');
    setTexto('');
  };

  const handleSubmit = async () => {
    // Validação
    if (!titulo || !titulo.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a nota oficial.",
        variant: "destructive"
      });
      return;
    }

    if (!texto || !texto.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, informe o conteúdo da nota oficial.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDemanda || !selectedDemandaId) {
      toast({
        title: "Demanda inválida",
        description: "Selecione uma demanda válida para criar a nota.",
        variant: "destructive"
      });
      return;
    }

    if (!user || !user.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar uma nota oficial.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting nota form with data:", {
        titulo,
        texto,
        demandaId: selectedDemandaId,
        userId: user.id
      });
      
      // First, ensure we have a valid problema_id - use the existing one or get/create one if needed
      let problemaId = selectedDemanda.problema_id || selectedDemanda.problema?.id;
      
      // If no problema_id exists, we need to find or create one
      if (!problemaId) {
        console.log("No problema_id found, looking for or creating one");
        
        // First try to find a problema for the coordenacao
        if (selectedDemanda.coordenacao_id) {
          const { data: existingProblema, error: findError } = await supabase
            .from('problemas')
            .select('id')
            .eq('coordenacao_id', selectedDemanda.coordenacao_id)
            .limit(1)
            .maybeSingle();
          
          if (findError) {
            console.error("Error finding problema:", findError);
          } else if (existingProblema) {
            problemaId = existingProblema.id;
            console.log("Found existing problema:", problemaId);
          } else {
            // Create a new problema for this coordenacao
            const { data: newProblema, error: createError } = await supabase
              .from('problemas')
              .insert({
                descricao: 'Problema Padrão',
                coordenacao_id: selectedDemanda.coordenacao_id
              })
              .select()
              .single();
              
            if (createError) {
              console.error("Error creating problema:", createError);
              throw new Error("Não foi possível criar problema para a coordenação: " + createError.message);
            } else {
              problemaId = newProblema.id;
              console.log("Created new problema:", problemaId);
            }
          }
        } else {
          throw new Error("A demanda não possui coordenação associada, necessária para criar um problema.");
        }
      }
      
      console.log("Using problema_id:", problemaId);
      
      // Create the nota with validations
      const notaData = {
        titulo,
        texto,
        coordenacao_id: selectedDemanda.coordenacao_id,
        autor_id: user.id,
        status: 'pendente',
        demanda_id: selectedDemandaId,
        problema_id: problemaId
      };
      
      // Validate that all required fields are present
      if (!notaData.titulo || !notaData.texto || !notaData.problema_id || !notaData.autor_id) {
        throw new Error("Campos obrigatórios não preenchidos corretamente.");
      }
      
      console.log("Creating nota with data:", notaData);
      
      const { data: notaResult, error: notaError } = await supabase
        .from('notas_oficiais')
        .insert(notaData)
        .select();
      
      if (notaError) {
        console.error("Error inserting nota:", notaError);
        throw notaError;
      }
      
      console.log("Nota created successfully:", notaResult);
      
      // Now update demanda status to indicate a note has been created
      // Important: Use correct status from the allowed values for demandas table
      const { error: updateError } = await supabase
        .from('demandas')
        .update({ status: 'aguardando_aprovacao' })
        .eq('id', selectedDemandaId);
        
      if (updateError) {
        console.error('Error updating demand status:', updateError);
        // Don't throw here - the note was already created successfully
        toast({
          title: "Aviso",
          description: "Nota criada com sucesso, mas não foi possível atualizar o status da demanda automaticamente.",
          variant: "warning"
        });
      } else {
        console.log("Demand status updated to 'aguardando_aprovacao'");
      }
      
      toast({
        title: "Nota oficial criada com sucesso!",
        description: "A nota foi enviada para aprovação.",
      });
      
      // Redirect to the dashboard
      navigate('/dashboard/comunicacao');
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

  // Get formatted responses from the formatted responses utility
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
    comentarios,
    handleDemandaSelect,
    handleBackToSelection,
    handleSubmit
  };
};
