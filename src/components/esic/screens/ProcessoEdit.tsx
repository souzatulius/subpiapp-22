
import React, { useState, useEffect } from 'react';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';
import ProcessoForm from '@/components/esic/ProcessoForm';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

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
  const [isLoadingCoords, setIsLoadingCoords] = useState(true);

  // Convert processo to form values
  const defaultValues: Partial<ESICProcessoFormValues> = {
    data_processo: processo.data_processo ? new Date(processo.data_processo) : new Date(),
    assunto: processo.assunto,
    protocolo: processo.protocolo,
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
      } finally {
        setIsLoadingCoords(false);
      }
    };

    fetchCoordenacoes();
  }, []);

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Editar Processo e-SIC</h1>
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
      
      {isLoading || isLoadingCoords ? (
        <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : processo ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <ProcessoForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isSubmitting={isLoading}
            onCancel={onCancel}
            coordenacoes={coordenacoes}
            isEditing={true}
          />
        </div>
      ) : (
        <div className="text-center bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-red-500">Processo não encontrado</p>
        </div>
      )}
    </div>
  );
};

export default ProcessoEdit;
