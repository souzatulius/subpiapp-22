
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DemandFormData } from './types';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const useDemandFormSubmit = (
  userId: string | undefined,
  formData: DemandFormData,
  selectedFile: File | null,
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

      // Upload file if selected
      let fileUrl = formData.arquivo_url;
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('demand_attachments')
          .upload(filePath, selectedFile);
          
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          throw new Error(`Erro ao enviar o arquivo: ${uploadError.message}`);
        }
        
        // Get public URL for the file
        const { data: publicUrlData } = supabase.storage
          .from('demand_attachments')
          .getPublicUrl(filePath);
          
        fileUrl = publicUrlData.publicUrl;
      }

      // Filter out empty questions
      const filteredPerguntas = formData.perguntas.filter(p => p.trim() !== '');
      
      // Prepare demand data - ensuring prioridade value is compatible with constraint
      // Converting 'média' to 'media' to match the constraint
      let normalizedPrioridade = formData.prioridade.toLowerCase();
      if (normalizedPrioridade === 'média') {
        normalizedPrioridade = 'media';
      }
      
      // Ensure it's one of the allowed values
      if (!['alta', 'media', 'baixa'].includes(normalizedPrioridade)) {
        normalizedPrioridade = 'media'; // Default to media if invalid
      }
      
      // Format the date properly for Supabase
      const prazoResposta = formData.prazo_resposta ? new Date(formData.prazo_resposta).toISOString() : null;
      
      // Prepare data for submission
      const demandaData = {
        ...formData,
        prazo_resposta: prazoResposta,
        prioridade: normalizedPrioridade,
        perguntas: filteredPerguntas.length > 0 ? filteredPerguntas : null,
        autor_id: userId,
        status: 'pendente', // Setting the initial status as 'pendente' which will display as 'Nova',
        arquivo_url: fileUrl,
        arquivo_nome: selectedFile ? selectedFile.name : formData.arquivo_nome
      };

      console.log('Submitting demand data:', demandaData);

      // Insert into demandas table
      const { data, error } = await supabase
        .from('demandas')
        .insert([demandaData])
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      toast.success("Demanda cadastrada com sucesso!", {
        description: "A solicitação foi registrada no sistema."
      });
      
      // Redirect to dashboard
      navigate('/dashboard/comunicacao/consultar-demandas');
    } catch (error: any) {
      console.error('Erro ao cadastrar demanda:', error);
      toast.error("Erro ao cadastrar demanda", {
        description: error.message || "Ocorreu um erro ao processar sua solicitação."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
};
