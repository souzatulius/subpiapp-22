
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { serviceSchema, Area } from '@/hooks/useServices';

interface ServiceFormProps {
  onSubmit: (data: { descricao: string; area_coordenacao_id: string }) => Promise<void>;
  onCancel: () => void;
  defaultValues?: {
    descricao: string;
    area_coordenacao_id: string;
  };
  areas: Area[];
  isSubmitting: boolean;
  submitText?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    descricao: '',
    area_coordenacao_id: '',
  },
  areas,
  isSubmitting,
  submitText = 'Salvar'
}) => {
  return (
    <DataEntryForm
      schema={serviceSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={defaultValues}
      renderFields={({ register, formState }) => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register("descricao")}
              className="rounded-lg"
            />
            {formState.errors.descricao && (
              <p className="text-sm text-red-500">{formState.errors.descricao.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="area_coordenacao_id">Área de Coordenação</Label>
            <select
              id="area_coordenacao_id"
              {...register("area_coordenacao_id")}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione uma área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.descricao}
                </option>
              ))}
            </select>
            {formState.errors.area_coordenacao_id && (
              <p className="text-sm text-red-500">{formState.errors.area_coordenacao_id.message}</p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
      submitText={submitText}
    />
  );
};

export default ServiceForm;
