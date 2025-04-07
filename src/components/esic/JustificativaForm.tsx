
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { ESICJustificativaFormValues } from '@/types/esic';

const justificativaSchema = z.object({
  texto: z.string().min(10, "A justificativa deve ter no mínimo 10 caracteres"),
});

interface JustificativaFormProps {
  onSubmit: (values: ESICJustificativaFormValues) => void;
  onGenerateAI: () => void;
  isLoading: boolean;
  isGenerating: boolean;
  processoTexto: string;
}

const JustificativaForm: React.FC<JustificativaFormProps> = ({ 
  onSubmit, 
  onGenerateAI,
  isLoading,
  isGenerating,
  processoTexto 
}) => {
  const form = useForm<ESICJustificativaFormValues>({
    resolver: zodResolver(justificativaSchema),
    defaultValues: {
      texto: '',
      gerado_por_ia: false,
    },
  });

  const handleManualSubmit = (values: ESICJustificativaFormValues) => {
    onSubmit({
      ...values,
      gerado_por_ia: false,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Nova Justificativa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-medium mb-2 text-sm text-gray-700">Texto do Processo:</h3>
          <p className="text-gray-600 text-sm">{processoTexto}</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleManualSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto da Justificativa</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escreva a justificativa..." 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 sm:flex-none"
                onClick={onGenerateAI}
                disabled={isGenerating || isLoading}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar com IA
                  </>
                )}
              </Button>
              <Button 
                type="submit" 
                className="flex-1 sm:flex-none"
                disabled={isLoading || isGenerating}
              >
                {isLoading ? 'Salvando...' : 'Salvar Justificativa Manual'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JustificativaForm;
