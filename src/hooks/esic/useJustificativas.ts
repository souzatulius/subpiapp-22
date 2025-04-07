
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ESICJustificativa, ESICJustificativaFormValues } from '@/types/esic';
import { useAuthState } from '@/hooks/auth/useAuthState';

export const useJustificativas = (processoId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuthState();

  // Fetch justifications for a specific process
  const { data: justificativas, isLoading, error, refetch } = useQuery({
    queryKey: ['esic-justificativas', processoId],
    queryFn: async () => {
      if (!processoId) return [];

      console.log('Fetching justificativas for processo:', processoId);
      const { data, error } = await supabase
        .from('esic_justificativas')
        .select(`
          *,
          autor:autor_id(nome_completo)
        `)
        .eq('processo_id', processoId)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching justificativas:', error);
        toast({
          title: 'Erro ao carregar justificativas',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Fetched justificativas:', data);
      return data as unknown as ESICJustificativa[];
    },
    enabled: !!processoId,
  });

  // Create new justification
  const createJustificativaMutation = useMutation({
    mutationFn: async ({ 
      values, 
      processoId 
    }: { 
      values: ESICJustificativaFormValues; 
      processoId: string 
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('esic_justificativas')
        .insert({
          processo_id: processoId,
          texto: values.texto,
          gerado_por_ia: values.gerado_por_ia,
          autor_id: user.id,
        })
        .select();

      if (error) {
        toast({
          title: 'Erro ao criar justificativa',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      // Update the process status to "aguardando_aprovacao"
      await supabase
        .from('esic_processos')
        .update({ status: 'aguardando_aprovacao' })
        .eq('id', processoId);

      toast({
        title: 'Justificativa criada com sucesso',
        variant: 'default',
      });

      return data[0] as ESICJustificativa;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['esic-justificativas', variables.processoId] });
      queryClient.invalidateQueries({ queryKey: ['esic-processos'] });
    },
  });

  // Generate justification with AI
  const generateJustificativaMutation = useMutation({
    mutationFn: async ({ 
      processoId, 
      processoTexto 
    }: { 
      processoId: string; 
      processoTexto: string 
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      try {
        // Make request to OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Você é um assistente especializado em elaborar justificativas formais para processos de e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão). Suas respostas devem ter tom institucional e impessoal, com clareza e objetividade. Elabore uma justificativa formal com no máximo 5 parágrafos.'
              },
              {
                role: 'user',
                content: `Elabore uma justificativa formal para o seguinte processo e-SIC: "${processoTexto}"`
              }
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        const data = await response.json();
        
        if (!data.choices || !data.choices[0]?.message?.content) {
          throw new Error('Falha na geração da justificativa pela IA');
        }

        const justificativaTexto = data.choices[0].message.content;

        // Save the generated justification
        const { data: justificativa, error } = await supabase
          .from('esic_justificativas')
          .insert({
            processo_id: processoId,
            texto: justificativaTexto,
            gerado_por_ia: true,
            autor_id: user.id,
          })
          .select();

        if (error) {
          throw error;
        }

        // Update the process status to "aguardando_aprovacao"
        await supabase
          .from('esic_processos')
          .update({ status: 'aguardando_aprovacao' })
          .eq('id', processoId);

        toast({
          title: 'Justificativa gerada com sucesso',
          variant: 'default',
        });

        return justificativa[0] as ESICJustificativa;
      } catch (error: any) {
        toast({
          title: 'Erro ao gerar justificativa',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['esic-justificativas', variables.processoId] });
      queryClient.invalidateQueries({ queryKey: ['esic-processos'] });
    },
  });

  return {
    justificativas,
    isLoading,
    error,
    refetch,
    createJustificativa: createJustificativaMutation.mutate,
    generateJustificativa: generateJustificativaMutation.mutate,
    isCreating: createJustificativaMutation.isPending,
    isGenerating: generateJustificativaMutation.isPending,
  };
};
