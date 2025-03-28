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
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      descricao: '',
      coordenacao_id: ''
    },
    resolver: zodResolver(problemSchema)
  });

  const selectedArea = watch('coordenacao_id');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            id="descricao"
            placeholder="Digite a descrição do tema"
            {...register('descricao', { required: 'Descrição é obrigatória' })}
            className={errors.descricao ? 'border-red-500' : ''}
          />
          {errors.descricao && (
            <p className="text-sm text-red-500">{errors.descricao.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coordenacao_id">Coordenação</Label>
          <CoordinationSelector
            onValueChange={(value) => setValue('coordenacao_id', value)}
            value={selectedArea}
          />
          {errors.coordenacao_id && (
            <p className="text-sm text-red-500">{errors.coordenacao_id.message}</p>
          )}
        </div>

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
