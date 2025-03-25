
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area } from '@/hooks/services/types';

interface ServiceFormProps {
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string }) => Promise<any>;
  onCancel: () => void;
  defaultValues?: {
    descricao: string;
    supervisao_tecnica_id: string;
  };
  areas: Area[];
  isSubmitting: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    descricao: '',
    supervisao_tecnica_id: '',
  },
  areas,
  isSubmitting
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues
  });

  const selectedAreaId = watch('supervisao_tecnica_id');

  const handleFormSubmit = async (data: any) => {
    console.log('Enviando dados do formulário:', data);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          placeholder="Digite a descrição do serviço"
          {...register('descricao', { required: 'Descrição é obrigatória' })}
          className={errors.descricao ? 'border-red-500' : ''}
        />
        {errors.descricao && (
          <p className="text-sm text-red-500">{errors.descricao.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="supervisao_tecnica_id">Supervisão Técnica</Label>
        <Select
          onValueChange={(value) => setValue('supervisao_tecnica_id', value)}
          value={selectedAreaId}
        >
          <SelectTrigger id="supervisao_tecnica_id" className={errors.supervisao_tecnica_id ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione uma supervisão técnica" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.supervisao_tecnica_id && (
          <p className="text-sm text-red-500">{errors.supervisao_tecnica_id.message}</p>
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

export default ServiceForm;
