
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { ESICJustificativaFormValues } from '@/types/esic';

const justificativaSchema = z.object({
  texto: z.string().min(10, "A justificativa deve ter no mínimo 10 caracteres")
});

interface JustificativaCreateProps {
  processoTexto: string;
  onSubmit: (values: ESICJustificativaFormValues) => void;
  onGenerate: () => void;
  onBack: () => void;
  isLoading: boolean;
  isGenerating: boolean;
}

const JustificativaCreate: React.FC<JustificativaCreateProps> = ({
  processoTexto,
  onSubmit,
  onGenerate,
  onBack,
  isLoading,
  isGenerating
}) => {
  const form = useForm<ESICJustificativaFormValues>({
    resolver: zodResolver(justificativaSchema),
    defaultValues: {
      texto: '',
      gerado_por_ia: false
    }
  });

  const handleGenerateClick = () => {
    onGenerate();
  };

  const handleSubmit = (values: ESICJustificativaFormValues) => {
    onSubmit(values);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h2 className="text-2xl font-semibold">Adicionar Justificativa</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Texto do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{processoTexto}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nova Justificativa</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="texto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto da Justificativa</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a justificativa para este processo..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateClick}
                    disabled={isGenerating}
                    className="flex items-center"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                  </Button>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Justificativa'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JustificativaCreate;
