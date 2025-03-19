
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface DataEntryFormProps {
  schema: z.ZodObject<any>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultValues: Record<string, any>;
  renderFields: (form: any) => React.ReactNode;
  isSubmitting?: boolean;
  submitText?: string;
  title?: string;
}

const DataEntryForm: React.FC<DataEntryFormProps> = ({
  schema,
  onSubmit,
  onCancel,
  defaultValues,
  renderFields,
  isSubmitting = false,
  submitText = 'Salvar',
  title,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao processar a solicitação.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {title && <h3 className="text-lg font-medium text-[#003570]">{title}</h3>}
        
        {renderFields(form)}
        
        <div className="flex justify-end gap-2">
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

export default DataEntryForm;
