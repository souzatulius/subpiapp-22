
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Area, problemSchema } from '@/hooks/useProblems';

interface ProblemFormProps {
  onSubmit: (data: { descricao: string; area_coordenacao_id: string }) => Promise<void>;
  onCancel: () => void;
  defaultValues?: { descricao: string; area_coordenacao_id: string };
  areas: Area[];
  isSubmitting: boolean;
  submitText?: string;
}

const ProblemForm: React.FC<ProblemFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = { descricao: '', area_coordenacao_id: '' },
  areas,
  isSubmitting,
  submitText = 'Salvar'
}) => {
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do problema"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="area_coordenacao_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área de Coordenação</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="action">
            {isSubmitting ? 'Processando...' : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProblemForm;
