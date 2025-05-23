
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cadastrarRelease } from '@/services/comunicacaoService';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

const releaseFormSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  texto: z.string().min(10, 'O texto deve ter pelo menos 10 caracteres'),
  tags: z.string().optional(),
});

type ReleaseFormValues = z.infer<typeof releaseFormSchema>;

interface CadastrarReleaseFormProps {
  onClose: () => void;
}

const CadastrarReleaseForm: React.FC<CadastrarReleaseFormProps> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showFeedback } = useAnimatedFeedback();

  const form = useForm<ReleaseFormValues>({
    resolver: zodResolver(releaseFormSchema),
    defaultValues: {
      titulo: '',
      texto: '',
      tags: '',
    },
  });

  const onSubmit = async (values: ReleaseFormValues) => {
    setIsSubmitting(true);
    try {
      await cadastrarRelease({
        titulo: values.titulo,
        texto: values.texto,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
      });
      
      showFeedback('success', 'Release cadastrado com sucesso');
      
      navigate('/dashboard/comunicacao/releases');
    } catch (error: any) {
      console.error('Erro ao cadastrar release:', error);
      showFeedback('error', error.message || 'Ocorreu um erro ao processar sua solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
      </div>

      <Card className="p-6 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cadastrar Release</h2>
            
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o título do release" 
                      {...field} 
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite o texto do release" 
                      rows={15}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: obras, zeladoria, praças" 
                      {...field}
                      className="w-full" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Salvar Release</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CadastrarReleaseForm;
