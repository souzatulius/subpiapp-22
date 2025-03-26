import { supabase } from '@/integrations/supabase/client';
import { DemandFormData } from './types';
import { toast } from '@/components/ui/use-toast';

export const useDemandFormSubmit = (
  userId: string | undefined,
  formData: DemandFormData,
  setIsLoading: (loading: boolean) => void,
  onClose: () => void
) => {
  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para cadastrar uma demanda.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const demandaData = {
        titulo: formData.titulo,
        problema_id: formData.problema_id,
        origem_id: formData.origem_id,
        tipo_midia_id: formData.tipo_midia_id || null,
        prioridade: formData.prioridade,
        prazo_resposta: formData.prazo_resposta,
        nome_solicitante: formData.nome_solicitante || null,
        telefone_solicitante: formData.telefone_solicitante || null,
        email_solicitante: formData.email_solicitante || null,
        veiculo_imprensa: formData.veiculo_imprensa || null,
        endereco: formData.endereco || null,
        bairro_id: formData.bairro_id || null,
        perguntas: Object.keys(perguntas).length > 0 ? perguntas : null,
        detalhes_solicitacao: formData.detalhes_solicitacao || null,
        arquivo_url: formData.arquivo_url || null,
        anexos: formData.anexos.length > 0 ? formData.anexos : null,
        autor_id: userId,
        status: 'pendente',
        horario_publicacao: new Date().toISOString(),
        protocolo: formData.tem_protocolo_156 ? formData.numero_protocolo_156 : null,
        servico_id: formData.nao_sabe_servico ? null : formData.servico_id || null
      };

      const { data: insertedDemanda, error: insertError } = await supabase
        .from('demandas')
        .insert(demandaData)
        .select('id')
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Demanda cadastrada com sucesso!",
        description: "A demanda foi cadastrada e será encaminhada para a área responsável.",
        variant: "default"
      });

      onClose();
    } catch (error: any) {
      console.error("Error submitting demand:", error);
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
