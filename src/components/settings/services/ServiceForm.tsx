
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

// Define the schema for multiple services
const serviceItemSchema = z.object({
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
});

const multiServiceSchema = z.object({
  supervisao_tecnica_id: z.string({ required_error: "A supervisão técnica é obrigatória" }),
  services: z.array(serviceItemSchema).min(1, { message: "Adicione pelo menos um serviço" }),
});

interface ServiceFormProps {
  onSubmit: (data: z.infer<typeof multiServiceSchema>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [areas, setAreas] = useState<{ id: string; descricao: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof multiServiceSchema>>({
    resolver: zodResolver(multiServiceSchema),
    defaultValues: {
      supervisao_tecnica_id: '',
      services: [{ descricao: '' }],
    }
  });

  // Use fieldArray to handle dynamic fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
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

  const handleSubmit = async (data: z.infer<typeof multiServiceSchema>) => {
    await onSubmit(data);
    form.reset({
      supervisao_tecnica_id: '',
      services: [{ descricao: '' }],
    });
  };

  // Auto-add a new field when user starts typing in the last field
  const handleInputChange = (index: number, value: string) => {
    if (index === fields.length - 1 && value.length > 0) {
      append({ descricao: '' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    <SelectValue placeholder="Selecione" />
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

        <div className="space-y-4">
          <FormLabel>Descrição dos Serviços</FormLabel>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`services.${index}.descricao`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input 
                        placeholder="Digite a descrição do serviço" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          handleInputChange(index, e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {fields.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-10 w-10 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ descricao: '' })}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar serviço
          </Button>
        </div>

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
