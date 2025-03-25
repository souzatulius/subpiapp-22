
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DemandFormData } from './types';
import { useNavigate } from 'react-router-dom';

export const useDemandFormSubmit = (
  userId: string | undefined,
  formData: DemandFormData,
  setIsLoading: (loading: boolean) => void,
  onClose: () => void
) => {
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!userId) {
        throw new Error("Usuário não identificado. Por favor, faça login novamente.");
      }

      // Filtrar perguntas vazias
      const filteredPerguntas = formData.perguntas.filter(p => p.trim() !== '');
      
      // Preparar normalização da prioridade
      let normalizedPrioridade = formData.prioridade.toLowerCase();
      if (normalizedPrioridade === 'média') {
        normalizedPrioridade = 'media';
      }
      
      // Garantir valor permitido
      if (!['alta', 'media', 'baixa'].includes(normalizedPrioridade)) {
        normalizedPrioridade = 'media'; // Default para média se inválido
      }
      
      // Formatar data corretamente
      const prazoResposta = formData.prazo_resposta ? new Date(formData.prazo_resposta).toISOString() : null;
      
      // Obter a supervisão técnica do problema selecionado
      let supervisao_tecnica_id = null;
      
      if (formData.problema_id) {
        const { data: problemaData, error: problemaError } = await supabase
          .from('problemas')
          .select('supervisao_tecnica_id')
          .eq('id', formData.problema_id)
          .single();
          
        if (problemaError) throw problemaError;
        
        supervisao_tecnica_id = problemaData.supervisao_tecnica_id;
      }
      
      // Preparar dados para inserção
      const demandaData = {
        prazo_resposta: prazoResposta,
        prioridade: normalizedPrioridade,
        perguntas: filteredPerguntas.length > 0 ? filteredPerguntas : null,
        autor_id: userId,
        status: 'pendente',
        titulo: formData.titulo,
        supervisao_tecnica_id: supervisao_tecnica_id,
        problema_id: formData.problema_id,
        servico_id: formData.servico_id,
        origem_id: formData.origem_id,
        tipo_midia_id: formData.tipo_midia_id,
        bairro_id: formData.bairro_id,
        nome_solicitante: formData.nome_solicitante,
        email_solicitante: formData.email_solicitante,
        telefone_solicitante: formData.telefone_solicitante,
        veiculo_imprensa: formData.veiculo_imprensa,
        endereco: formData.endereco,
        detalhes_solicitacao: formData.detalhes_solicitacao,
        arquivo_url: formData.arquivo_url,
        tem_protocolo_156: formData.tem_protocolo_156,
        numero_protocolo_156: formData.tem_protocolo_156 ? formData.numero_protocolo_156 : null
      };

      console.log('Submitting demand data:', demandaData);

      // Inserir na tabela demandas
      const { data, error } = await supabase
        .from('demandas')
        .insert(demandaData)
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      toast({
        title: "Demanda cadastrada com sucesso!",
        description: "A solicitação foi registrada no sistema."
      });
      
      // Redirecionar para dashboard
      navigate('/dashboard/comunicacao/consultar-demandas');
    } catch (error: any) {
      console.error('Erro ao cadastrar demanda:', error);
      toast({
        title: "Erro ao cadastrar demanda",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
};
