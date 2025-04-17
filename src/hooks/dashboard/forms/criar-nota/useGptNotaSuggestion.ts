
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demand, ResponseQA } from '@/components/dashboard/forms/criar-nota/types';
import { supabase } from '@/integrations/supabase/client';

export const useGptNotaSuggestion = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSuggestion = async (
    selectedDemanda: Demand | null,
    formattedResponses: ResponseQA[] = []
  ) => {
    if (!selectedDemanda) {
      toast({
        title: "Erro",
        description: "Nenhuma demanda selecionada para gerar sugestão.",
        variant: "destructive"
      });
      return { titulo: '', nota: '' };
    }

    try {
      setIsGenerating(true);
      
      // Get current date formatted in Portuguese
      const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      
      // Prepare data for generation with fallbacks
      const problemSummary = selectedDemanda.titulo || 'Nota Oficial';
      const theme = selectedDemanda.problema?.descricao || '';
      const location = selectedDemanda.endereco || selectedDemanda.bairros?.nome || '';
      const status = selectedDemanda.status || 'pendente';
      const deadline = selectedDemanda.prazo_resposta 
        ? format(new Date(selectedDemanda.prazo_resposta), "dd/MM/yyyy", { locale: ptBR })
        : format(new Date(), "dd/MM/yyyy", { locale: ptBR });
      
      const demandInfo = {
        currentDate,
        problemSummary,
        theme,
        location,
        status,
        deadline,
        detalhes_solicitacao: selectedDemanda.detalhes_solicitacao || selectedDemanda.resumo_situacao || ''
      };
      
      console.log("Sending to generate-with-gpt edge function:", {
        tipo: 'nota_imprensa',
        dados: {
          resumo: problemSummary,
          perguntas: formattedResponses.map(qa => qa.question),
          respostas: formattedResponses.map(qa => qa.answer),
          dataAtual: currentDate,
          comentariosAdicionais: selectedDemanda.detalhes_solicitacao || ''
        }
      });
      
      // Use the unified edge function if available
      try {
        const { data, error } = await supabase.functions.invoke('generate-with-gpt', {
          body: {
            tipo: 'nota_imprensa',
            dados: {
              resumo: problemSummary,
              perguntas: formattedResponses.map(qa => qa.question),
              respostas: formattedResponses.map(qa => qa.answer),
              dataAtual: currentDate,
              comentariosAdicionais: selectedDemanda.detalhes_solicitacao || ''
            }
          }
        });
        
        if (error) throw error;
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        const resultado = data.resultado;
        
        // Extract title and content from the generated text
        const titleMatch = resultado.match(/^(.+?)(?:\r?\n|\r)/);
        let title = titleMatch ? titleMatch[1].trim() : selectedDemanda.titulo || '';
        const content = titleMatch 
          ? resultado.substring(titleMatch[0].length).trim()
          : resultado;
          
        // Remove any markdown formatting from the title (asterisks, etc.)
        title = title.replace(/\*\*/g, '').replace(/\*/g, '');
        
        return { titulo: title, nota: content };
      } catch (edgeFnError) {
        console.error('Error with generate-with-gpt function, falling back to direct function:', edgeFnError);
        
        // Try to use the generate-note-suggestion function as a fallback
        const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('generate-note-suggestion', {
          body: { 
            demandInfo, 
            responses: formattedResponses 
          }
        });
        
        if (fallbackError) throw fallbackError;
        
        return { 
          titulo: fallbackData.titulo || selectedDemanda.titulo || '', 
          nota: fallbackData.nota || '' 
        };
      }
    } catch (error: any) {
      console.error('Erro ao gerar sugestão:', error);
      toast({
        title: "Erro ao gerar sugestão",
        description: error.message || "Ocorreu um erro ao tentar gerar a sugestão de nota.",
        variant: "destructive"
      });
      
      return { titulo: '', nota: '' };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateSuggestion
  };
};
