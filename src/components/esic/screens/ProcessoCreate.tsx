import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ProcessoForm } from '@/components/esic/ProcessoForm';
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
          .select('id, nome')
          .order('nome');

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
          setCoordenacoes(data);
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
      const { data, error } = await supabase
        .from('esic_processos')
        .insert([
          {
            ...values,
            data_processo: new Date(values.data_processo).toISOString(),
          },
        ])
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
      
      <ProcessoForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        coordenacoes={coordenacoes}
      />
    </div>
  );
};

export default ProcessoCreate;
