
import React, { useState, useEffect } from 'react';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';
import ProcessoForm from '@/components/esic/ProcessoForm';
import { supabase } from '@/integrations/supabase/client';

interface ProcessoEditProps {
  processo: ESICProcesso;
  onSubmit: (values: ESICProcessoFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const ProcessoEdit: React.FC<ProcessoEditProps> = ({
  processo,
  onSubmit,
  isLoading,
  onCancel
}) => {
  const [coordenacoes, setCoordenacoes] = useState<{ id: string; nome: string }[]>([]);

  // Convert processo to form values
  const defaultValues: Partial<ESICProcessoFormValues> = {
    data_processo: processo.data_processo ? new Date(processo.data_processo) : new Date(),
    assunto: processo.assunto,
    solicitante: processo.solicitante,
    texto: processo.texto,
    situacao: processo.situacao,
    coordenacao_id: processo.coordenacao_id,
    prazo_resposta: processo.prazo_resposta ? new Date(processo.prazo_resposta) : undefined,
    sem_area_tecnica: !processo.coordenacao_id,
    sem_identificacao: processo.solicitante === 'Sem identificação',
  };

  // Fetch coordenações when component mounts
  useEffect(() => {
    const fetchCoordenacoes = async () => {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (error) throw error;
        
        if (data) {
          setCoordenacoes(data.map(item => ({
            id: item.id,
            nome: item.descricao
          })));
        }
      } catch (err) {
        console.error('Error fetching coordenações:', err);
      }
    };

    fetchCoordenacoes();
  }, []);

  return (
    <ProcessoForm 
      defaultValues={defaultValues}
      onSubmit={onSubmit} 
      isSubmitting={isLoading}
      onCancel={onCancel}
      coordenacoes={coordenacoes}
      isEditing={true}
    />
  );
};

export default ProcessoEdit;
