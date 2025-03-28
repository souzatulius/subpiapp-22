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
import { IconSelector } from './IconSelector';

interface ProblemFormProps {
  onSubmit: (data: { descricao: string; coordenacao_id: string; icone?: string }) => Promise<void>;
  onCancel: () => void;
  areas: Area[];
  isSubmitting: boolean;
}

const ProblemForm: React.FC<ProblemFormProps> = ({ 
  onSubmit, 
  onCancel, 
  areas, 
  isSubmitting 
}) => {
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      descricao: '',
      coordenacao_id: '',
      icone: 'alert-circle'
    }
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      // Error is handled in the parent component
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
                <Input placeholder="Descrição do problema" {...field} />
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
                <CoordinationSelector areas={areas} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícone</FormLabel>
              <FormControl>
                <IconSelector field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
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

export default ProblemForm;
