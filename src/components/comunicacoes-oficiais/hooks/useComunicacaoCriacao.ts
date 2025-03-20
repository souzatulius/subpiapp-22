
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '../types';
import { formatarPerguntasRespostas } from '../utils/formatarPerguntasRespostas';

export function useComunicacaoCriacao(demandaId: string, demanda: Demand | null, onClose: () => void) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isGerandoSugestao, setIsGerandoSugestao] = useState(false);
  const queryClient = useQueryClient();
  
  const criarComunicacaoMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!demanda?.areas_coordenacao?.id) {
        throw new Error('Dados insuficientes para criar a comunicação oficial');
      }
      
      const { data, error } = await supabase
        .from('comunicacoes_oficiais')
        .insert([{
          titulo,
          texto,
          autor_id: userId,
          area_coordenacao_id: demanda.areas_coordenacao.id,
          demanda_id: demandaId,
          status: 'pendente'
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Comunicação oficial criada',
        description: 'A comunicação oficial foi criada com sucesso e está aguardando aprovação.',
      });
      queryClient.invalidateQueries({ queryKey: ['comunicacao-oficial-existente', demandaId] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar comunicação',
        description: `Ocorreu um erro: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  const gerarSugestao = async () => {
    if (!demanda) {
      return;
    }

    try {
      setIsGerandoSugestao(true);
      
      const perguntasRespostas = formatarPerguntasRespostas(demanda);
      
      const { data, error } = await supabase.functions.invoke('generate-note-suggestion', {
        body: {
          demandInfo: demanda,
          responses: perguntasRespostas
        }
      });

      if (error) {
        console.error('Erro ao chamar a edge function:', error);
        throw new Error(`Erro ao chamar a Edge Function: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Erro retornado pela edge function:', data.error);
        throw new Error(data.error);
      }

      if (data.suggestion) {
        // Try to extract a title and content from the suggestion
        const lines = data.suggestion.split('\n');
        let suggestedTitle = '';
        let suggestedContent = data.suggestion;
        
        // Check if the first non-empty line could be a title
        for (let i = 0; i < Math.min(5, lines.length); i++) {
          if (lines[i].trim()) {
            // Check if it's likely a title (short, no punctuation at end)
            if (lines[i].length < 100 && !lines[i].endsWith('.')) {
              suggestedTitle = lines[i].replace(/^(título:|titulo:)/i, '').trim();
              suggestedContent = lines.slice(i + 1).join('\n').trim();
              break;
            }
          }
        }
        
        if (suggestedTitle) setTitulo(suggestedTitle);
        setTexto(suggestedContent);
        
        toast({
          title: "Sugestão gerada automaticamente",
          description: "Uma sugestão de comunicação foi gerada com base nos dados da demanda. Você pode editá-la conforme necessário."
        });
      } else {
        throw new Error("A resposta não contém uma sugestão válida");
      }
    } catch (error: any) {
      console.error('Erro ao gerar sugestão:', error);
      toast({
        title: "Erro ao gerar sugestão",
        description: error.message || "Ocorreu um erro ao tentar gerar a sugestão de comunicação.",
        variant: "destructive"
      });
    } finally {
      setIsGerandoSugestao(false);
    }
  };

  // Gerar sugestão automaticamente quando a demanda é carregada
  useEffect(() => {
    if (demanda && !texto) {
      gerarSugestao();
    }
  }, [demanda]);
  
  const handleSubmit = (userId: string) => {
    if (!titulo.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, informe um título para a comunicação oficial.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!texto.trim()) {
      toast({
        title: 'Conteúdo obrigatório',
        description: 'Por favor, informe o conteúdo da comunicação oficial.',
        variant: 'destructive',
      });
      return;
    }
    
    criarComunicacaoMutation.mutate(userId);
  };
  
  return {
    titulo,
    setTitulo,
    texto,
    setTexto,
    gerarSugestao,
    isGerandoSugestao,
    handleSubmit,
    isPending: criarComunicacaoMutation.isPending
  };
}
