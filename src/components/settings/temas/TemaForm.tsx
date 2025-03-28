
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Area, problemSchema } from '@/hooks/problems/types';
import { CoordinationSelector } from '../selectors/CoordinationSelector';

interface TemaFormProps {
  onSubmit: (data: { descricao: string; coordenacao_id: string }) => Promise<void>;
  onCancel: () => void;
  areas: Area[];
  isSubmitting: boolean;
}

const TemaForm: React.FC<TemaFormProps> = ({ 
  onSubmit, 
  onCancel, 
  areas, 
  isSubmitting 
}) => {
  const form = useForm({
    defaultValues: {
      descricao: '',
      coordenacao_id: ''
    },
    resolver: zodResolver(problemSchema)
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite a descrição do tema"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coordenacao_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordenação</FormLabel>
              <FormControl>
                <CoordinationSelector
                  areas={areas}
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TemaForm;
