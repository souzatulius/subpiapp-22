
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProcessoForm from '@/components/esic/ProcessoForm';
import { ESICProcessoFormValues } from '@/types/esic';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const ProcessoCreate: React.FC = () => {
  const navigate = useNavigate();
  const [coordenacoes, setCoordenacoes] = useState<{ id: string; nome: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCoordenacoes = async () => {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao');

        if (error) {
          console.error('Error fetching coordenacoes:', error);
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar as coordenações',
            variant: 'destructive',
          });
          return;
        }

        if (data) {
          // Map 'descricao' to 'nome' to match the expected interface
          const formattedCoords = data.map(coord => ({
            id: coord.id,
            nome: coord.descricao
          }));
          setCoordenacoes(formattedCoords);
        }
      } catch (error) {
        console.error('Error fetching coordenacoes:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao carregar as coordenações',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordenacoes();
  }, []);

  const handleSubmit = async (values: ESICProcessoFormValues) => {
    setIsSubmitting(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const processoData = {
        protocolo: values.protocolo,
        assunto: values.assunto,
        solicitante: values.sem_identificacao ? 'Sem identificação' : values.solicitante,
        data_processo: values.data_processo instanceof Date ? 
          values.data_processo.toISOString().split('T')[0] : 
          values.data_processo,
        autor_id: user.id,
        texto: values.texto,
        situacao: values.situacao,
        status: 'novo_processo',
        coordenacao_id: values.sem_area_tecnica ? null : values.coordenacao_id,
        prazo_resposta: values.prazo_resposta instanceof Date ?
          values.prazo_resposta.toISOString().split('T')[0] :
          values.prazo_resposta
      };
      
      const { data, error } = await supabase
        .from('esic_processos')
        .insert(processoData)
        .select();

      if (error) {
        console.error('Error creating processo:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao criar o processo',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        toast({
          title: 'Sucesso',
          description: 'Processo criado com sucesso',
        });
        navigate('/dashboard/esic');
      }
    } catch (error) {
      console.error('Error creating processo:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar o processo',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/esic');
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Novo Processo e-SIC</h1>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ProcessoForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
          coordenacoes={coordenacoes}
        />
      )}
    </div>
  );
};

export default ProcessoCreate;
