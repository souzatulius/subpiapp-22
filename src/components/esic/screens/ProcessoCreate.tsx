
import React, { useState, useEffect } from 'react';
import { ESICProcessoFormValues } from '@/types/esic';
import ProcessoForm from '@/components/esic/ProcessoForm';
import { supabase } from '@/integrations/supabase/client';

interface ProcessoCreateProps {
  onSubmit: (values: ESICProcessoFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const ProcessoCreate: React.FC<ProcessoCreateProps> = ({
  onSubmit,
  isLoading,
  onCancel
}) => {
  const [coordenacoes, setCoordenacoes] = useState<{ id: string; nome: string }[]>([]);

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
      onSubmit={onSubmit} 
      isSubmitting={isLoading}
      onCancel={onCancel}
      coordenacoes={coordenacoes}
    />
  );
};

export default ProcessoCreate;
