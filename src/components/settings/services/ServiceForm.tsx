
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { serviceSchema } from '@/types/service';

interface ServiceFormProps {
  onSubmit: (data: z.infer<typeof serviceSchema>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: z.infer<typeof serviceSchema>;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  initialData
}) => {
  const [areas, setAreas] = useState<{ id: string; descricao: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      descricao: '',
      supervisao_tecnica_id: '',
    }
  });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        console.log('Fetching supervision areas...');
        const { data, error } = await supabase
          .from('supervisoes_tecnicas')
          .select('id, descricao, coordenacao_id')
          .order('descricao');

        if (error) throw error;
        
        // Filter out areas with empty IDs
        const validAreas = (data || []).filter(area => area.id && area.id.trim() !== '');
        console.log('Areas fetched:', validAreas);
        setAreas(validAreas);
      } catch (error) {
        console.error('Error fetching areas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSubmit = async (data: z.infer<typeof serviceSchema>) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              <FormLabel>Supervisão Técnica</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma supervisão técnica" />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
