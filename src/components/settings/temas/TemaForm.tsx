
import React from 'react';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Area } from '@/hooks/coordination-areas/useCoordinationAreas';

// Schema for tema validation - using the same as problem
export const temaSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  area_coordenacao_id: z.string().min(1, 'Selecione uma área de coordenação'),
});

interface TemaFormProps {
  onSubmit: (data: z.infer<typeof temaSchema>) => Promise<void>;
  onCancel: () => void;
  areas: Area[];
  isSubmitting: boolean;
  defaultValues?: z.infer<typeof temaSchema>;
  submitText?: string;
}

const TemaForm: React.FC<TemaFormProps> = ({
  onSubmit,
  onCancel,
  areas,
  isSubmitting,
  defaultValues = { descricao: '', area_coordenacao_id: '' },
  submitText = 'Salvar'
}) => {
  const form = useForm<z.infer<typeof temaSchema>>({
    resolver: zodResolver(temaSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input
                  className="rounded-lg"
                  {...field}
                  placeholder="Nome do tema"
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
              <FormLabel>Supervisão Técnica</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-lg">
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

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg"
          >
            {isSubmitting ? 'Salvando...' : submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TemaForm;
