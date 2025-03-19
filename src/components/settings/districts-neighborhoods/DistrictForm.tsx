
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

export const districtSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
});

interface DistrictFormProps {
  onSubmit: (data: z.infer<typeof districtSchema>) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: z.infer<typeof districtSchema>;
  onCancel: () => void;
}

const DistrictForm: React.FC<DistrictFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues = { nome: '' },
  onCancel,
}) => {
  const form = useForm<z.infer<typeof districtSchema>>({
    resolver: zodResolver(districtSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input className="rounded-lg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="rounded-lg">
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DistrictForm;
