
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const serviceSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  supervisao_tecnica_id: z.string().min(1, 'Selecione uma coordenação')
});

interface ServiceFormProps {
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const [coordinations, setCoordenations] = useState<{ id: string; descricao: string }[]>([]);

  useEffect(() => {
    const fetchCoordenations = async () => {
      const { data, error } = await supabase
        .from('coordenacoes')
        .select('id, descricao')
        .order('descricao');

      if (data) setCoordenations(data);
      if (error) console.error('Error fetching coordinations:', error);
    };

    fetchCoordenations();
  }, []);

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      descricao: '',
      supervisao_tecnica_id: ''
    }
  });

  const handleSubmit = async (data: z.infer<typeof serviceSchema>) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
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
              <FormLabel>Descrição do Serviço</FormLabel>
              <FormControl>
                <Input placeholder="Digite a descrição do serviço" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supervisao_tecnica_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordenação</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma coordenação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {coordinations.map((coordination) => (
                    <SelectItem 
                      key={coordination.id} 
                      value={coordination.id}
                    >
                      {coordination.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
