
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area } from '@/hooks/coordination-areas/types';

interface TemaFormProps {
  onSubmit: (data: { descricao: string; coordenacao_id: string }) => Promise<void>;
  onCancel: () => void;
  areas: Area[];
  isSubmitting: boolean;
}

const TemaForm = ({ onSubmit, onCancel, areas, isSubmitting }: TemaFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      descricao: '',
      coordenacao_id: ''
    }
  });

  const selectedArea = watch('coordenacao_id');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Select
          onValueChange={(value) => setValue('coordenacao_id', value)}
          value={selectedArea}
        >
          <SelectTrigger id="coordenacao_id" className={errors.coordenacao_id ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione uma coordenação" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
  );
};

export default TemaForm;
