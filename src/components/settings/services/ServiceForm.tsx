
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { serviceSchema } from '@/types/service';
import { SupervisaoTecnica } from '@/types/common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ServiceFormProps {
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string }) => Promise<void>;
  onCancel: () => void;
  defaultValues?: {
    descricao: string;
    supervisao_tecnica_id: string;
  };
  areas: SupervisaoTecnica[];
  isSubmitting: boolean;
  submitText?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    descricao: '',
    supervisao_tecnica_id: '',
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
      renderFields={({ register, formState, setValue, watch }) => (
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
            <Label htmlFor="supervisao_tecnica_id">Supervisão Técnica</Label>
            <Select 
              onValueChange={(value) => setValue("supervisao_tecnica_id", value)}
              defaultValue={defaultValues.supervisao_tecnica_id}
            >
              <SelectTrigger className="rounded-lg">
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
            {formState.errors.supervisao_tecnica_id && (
              <p className="text-sm text-red-500">{formState.errors.supervisao_tecnica_id.message}</p>
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
