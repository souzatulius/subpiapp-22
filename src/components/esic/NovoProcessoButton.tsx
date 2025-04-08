
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProcessoForm from '@/components/esic/ProcessoForm';
import { ESICProcessoFormValues } from '@/types/esic';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface NovoProcessoButtonProps {
  buttonText?: string;
  variant?: 'default' | 'action' | 'outline' | 'ghost';
  onSuccess?: () => void;
}

const NovoProcessoButton: React.FC<NovoProcessoButtonProps> = ({
  buttonText = 'Novo Processo',
  variant = 'action',
  onSuccess
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateProcesso = async (values: ESICProcessoFormValues) => {
    if (!user) {
      toast({
        title: 'Erro de autenticação',
        description: 'Você precisa estar logado para criar um processo.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const novoProcesso = {
        data_processo: values.data_processo.toISOString(),
        texto: values.texto,
        situacao: values.situacao,
        status: 'novo_processo',
        autor_id: user.id,
        solicitante: values.solicitante || null,
        coordenacao_id: values.coordenacao_id,
        prazo_resposta: values.prazo_resposta ? values.prazo_resposta.toISOString() : null
      };
      
      const { error } = await supabase
        .from('esic_processos')
        .insert(novoProcesso);
      
      if (error) throw error;
      
      toast({
        title: 'Processo criado com sucesso',
        description: 'O novo processo foi adicionado ao sistema.',
      });
      
      setIsDialogOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      toast({
        title: 'Erro ao criar processo',
        description: 'Não foi possível criar o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="flex items-center">
          <FilePlus className="h-5 w-5 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Novo Processo e-SIC</DialogTitle>
        </DialogHeader>
        <ProcessoForm 
          onSubmit={handleCreateProcesso} 
          isLoading={isSubmitting}
          onCancel={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NovoProcessoButton;
